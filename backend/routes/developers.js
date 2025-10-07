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