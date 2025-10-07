import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router()

//Recommend Users to Current User

router.get('/recommend',auth, async(req,res)=>{
    try {
        const { page = 1, limit = 10 } = req.query;

        const currentUserSkills = req.user.skills || [];

        if(currentUserSkills.length === 0){
          return res.json({ success: true, data: { developers: [], pagination: {...} } });
        }

         // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const limitNum = parseInt(limit);


        const developers = await User.find({
            _id : {$ne : req.user._id},
            skills : {$in : currentUserSkills}
        }).select('-password -email').lean()

        
        //calculating skillOverLap count
        const developersWithScore = developers.map(dev => {
          const overLapCount = dev.skills.filter(skill => {
            currentUserSkills.some(mySkill => {
              mySkill.toLowerCase() === skill.toLowerCase()
            })
          }).length()

          return {
            ...dev,
            skillOverlapCount : overLapCount
          }
        })

        developersWithScore.sort((a,b) => b.skillOverlapCount - a.skillOverlapCount)

        const paginatedDevelopers = developersWithScore.slice(skip, skip + limitNum);

        // Calculate pagination info
    const totalCount = developersWithScore.length;
    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: {
        developers: paginatedDevelopers,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });


    } catch (error) {
    console.error('Recommend developers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
})


//Searching Users based on skills, experience, location
router.post('/search',auth,async(req,res) => {
  try {
    const {skills, experienceLevel, location, page=1, limit=1}

    if(!skills && !experienceLevel && !location){
      return res.status(400).json({message : "Atleast One Field is required"})
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const query = {
      _id : {$ne : req.user._id}
    }

    if(skills){
      query.skills = skills
    }

    if(experienceLevel){
      query.experienceLevel = experienceLevel
    }

    if(location){
      query.location = location
    }

    const developers = await User.find(query).select('-password -email').sort({createdAt : -1}).skip(skip).limit(limitNum)

    const totalCount = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNum);

      res.json({
      success: true,
      data: {
        developers,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Search developers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
})


//searching all the Users
router.get('/',auth,async(req,res) => {
  try {
    const {page=1, limit=10} = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const developers = await User.find({
      _id : {$ne : req.user._id}
    }).select('-password -email').sort({createdAt : -1}).skip(skip).limit(limit)

    const totalCount = await User.countDocuments({_id : {$ne : req.user._id}})

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: {
        developers,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get developers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
})

export default router;