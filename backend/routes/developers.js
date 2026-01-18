// backend/routes/developers.js
import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/developers/recommend - recommend users based on current user's skills
router.get('/recommend', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const currentUser = await User.findById(req.userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    const currentUserSkills = currentUser.skills || [];

    if (currentUserSkills.length === 0) {
      return res.json({
        success: true,
        data: {
          developers: [],
          pagination: {
            currentPage: Number(page),
            totalPages: 0,
            totalCount: 0,
            hasNext: false,
            hasPrev: false,
          },
        },
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const developers = await User.find({
      _id: { $ne: currentUser._id },
      skills: { $in: currentUserSkills },
    })
      .select('-password -email')
      .lean();

    // calculate skill overlap score
    const developersWithScore = developers
      .map((dev) => {
        const overlapCount = (dev.skills || []).filter((skill) =>
          (currentUserSkills || []).some(
            (mySkill) =>
              mySkill.toLowerCase() === String(skill).toLowerCase()
          )
        ).length;

        return {
          ...dev,
          skillOverlapCount: overlapCount,
        };
      })
      .sort((a, b) => b.skillOverlapCount - a.skillOverlapCount);

    const totalCount = developersWithScore.length;
    const totalPages = Math.ceil(totalCount / limitNum);
    const paginatedDevelopers = developersWithScore.slice(
      skip,
      skip + limitNum
    );

    console.log("TOTAL MATCHED:", totalCount);


    res.json({
      success: true,
      data: {
        developers: paginatedDevelopers,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/developers/search - search by skills, experience, location
router.post('/search', auth, async (req, res) => {
  try {
    const {
      skills,
      experienceLevel,
      location,
      page = 1,
      limit = 10,
    } = req.body;

    if (!skills && !experienceLevel && !location) {
      return res
        .status(400)
        .json({ message: 'At least one field is required' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const query = {
      _id: { $ne: req.userId },
    };

    if (skills && Array.isArray(skills) && skills.length > 0) {
      query.skills = { $in: skills };
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (location) {
      query.location = location;
    }

    const developers = await User.find(query)
      .select('-password -email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

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
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/developers - list all other users
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const developers = await User.find({
      _id: { $ne: req.userId },
    })
      .select('-password -email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalCount = await User.countDocuments({
      _id: { $ne: req.userId },
    });

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
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
  
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
