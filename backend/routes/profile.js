import auth from "../middleware/auth.js";
import User from "../models/User.js";
import express from "express";import upload from "../config/multer.js";         // A. Import multer
import { v2 as cloudinary } from "cloudinary";                                 // B. Import Cloudinary
import { Readable } from "stream";                                            // C. Import Node stream helper


const router = express.Router();


// Configure Cloudinary with your dashboard credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//Updating Profile
// router.put('/',auth, async(req,res)=>{
//     try {
//         const {
//       skills,
//       experienceLevel,
//       bio,
//       location,
//       github,
//       linkedin,
//       portfolio
//     } = req.body;

//      const validExperienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

//     if (experienceLevel && !validExperienceLevels.includes(experienceLevel)) {
//       return res.status(400).json({
//         message: 'Invalid experience level. Must be one of: Beginner, Intermediate, Advanced, Expert'
//       });
//     }

//      if (skills && !Array.isArray(skills)) {
//       return res.status(400).json({
//         message: 'Skills must be an array'
//       });
//     }

//     const updatedFields = {}

// if (Array.isArray(skills)) {
//   updatedFields.skills = skills;
// }
// console.log("Incoming skills:", skills);

//     if (experienceLevel !== undefined) updatedFields.experienceLevel = experienceLevel
//     if (bio !== undefined) updatedFields.bio = bio
//     if (location !== undefined) updatedFields.location = location;
//     if (github !== undefined) updatedFields.github = github;
//     if (linkedin !== undefined) updatedFields.linkedin = linkedin;
//     if (portfolio !== undefined) updatedFields.portfolio = portfolio;

//     // const updatedUser = await User.findByIdAndUpdate(req.user._id, {$set : updatedFields}, { new: true, runValidators: true }
//     // ).select('-password');

//     const updatedUser = await User.findByIdAndUpdate(
//     req.userId,
//     { $set: updatedFields },
//     { new: true, runValidators: true }
//     ).select('-password');

//      if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({
//       success: true,
//       message: 'Profile updated successfully',
//       data: updatedUser
//     });
//   } catch (error) {
//     console.error('Update profile error:', error);

//     if (error.name === 'ValidationError') {
//       return res.status(400).json({
//         message: 'Validation error',
//         errors: Object.values(error.errors).map(err => err.message)
//       });
//     }

//     res.status(500).json({ message: 'Server error' });
//   }
// })

router.put("/", auth, async (req, res) => {
  try {
    const {
      skills,
      experienceLevel,
      bio,
      location,
      github,
      linkedin,
      portfolio,
    } = req.body;

    const update = {};

    if (Array.isArray(skills)) update.skills = skills;
    if (experienceLevel !== undefined) update.experienceLevel = experienceLevel;
    if (bio !== undefined) update.bio = bio;
    if (location !== undefined) update.location = location;
    if (github !== undefined) update.github = github;
    if (linkedin !== undefined) update.linkedin = linkedin;
    if (portfolio !== undefined) update.portfolio = portfolio;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: update }, // ← clean single $set ✅
      { new: true, runValidators: true },
    ).select("-password");

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//Fetching Profile of Others

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(userId).select("-password -email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/profile/avatar - Upload user avatar to Cloudinary
router.put('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    // A. Check if Multer actually received a file
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // B. Create a Cloudinary upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'devmatch_avatars' }, // Saves images inside a specific folder in your Cloudinary space
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ message: 'Failed to upload image to cloud' });
        }

        // C. Save the secure Cloudinary URL (result.secure_url) to MongoDB
        const updatedUser = await User.findByIdAndUpdate(
          req.userId,
          { avatar: result.secure_url },
          { new: true }
        ).select('-password');

        // D. Return the updated user object to the frontend
        res.json({
          success: true,
          message: 'Avatar uploaded successfully',
          data: updatedUser,
        });
      }
    );

    // E. Pipe the memory file buffer directly into the Cloudinary upload stream
    Readable.from(req.file.buffer).pipe(uploadStream);

  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});


export default router;
