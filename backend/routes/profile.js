import auth from "../middleware/auth.js";
import User from "../models/User.js";
import express from 'express';

const router = express.Router()

router.get('/',auth, async(req,res)=>{
    try {
        const user = await User.findById(req.userId).select('-password')

        if(!user){
           return res.status(404).json({ message: 'User not found' });
        }

        return res.json({
      success: true,
      data: user
    });

    } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }

})

//Updating Profile
router.put('/',auth, async(req,res)=>{
    try {
        const {
      skills,
      experienceLevel,
      bio,
      location,
      github,
      linkedin,
      portfolio
    } = req.body;

     const validExperienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

    if (experienceLevel && !validExperienceLevels.includes(experienceLevel)) {
      return res.status(400).json({ 
        message: 'Invalid experience level. Must be one of: Beginner, Intermediate, Advanced, Expert' 
      });
    }

     if (skills && !Array.isArray(skills)) {
      return res.status(400).json({ 
        message: 'Skills must be an array' 
      });
    }

    const updatedFields = {}

    if (skills !== undefined) updatedFields.skills = skills
    if (experienceLevel !== undefined) updatedFields.experienceLevel = experienceLevel
    if (bio !== undefined) updatedFields.bio = bio 
    if (location !== undefined) updatedFields.location = location;
    if (github !== undefined) updatedFields.github = github;
    if (linkedin !== undefined) updatedFields.linkedin = linkedin;
    if (portfolio !== undefined) updatedFields.portfolio = portfolio;

    // const updatedUser = await User.findByIdAndUpdate(req.user._id, {$set : updatedFields}, { new: true, runValidators: true }
    // ).select('-password');


    const updatedUser = await User.findByIdAndUpdate(
    req.userId,
    { $set: updatedFields },
    { new: true, runValidators: true }
    ).select('-password');


     if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
})


//Fetching Profile of Others

router.get('/:userId', async(req,res) => {
    try {
        const {userId} = req.params;
         if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await User.findById(userId).select('-password -email');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;