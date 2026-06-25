import multer from 'multer';
import path from 'path';

// 1. Configure storage to load the file into memory buffer (RAM)
const storage = multer.memoryStorage();

// 2. Define a security filter to only allow standard images
const fileFilter = (req, file, cb) => {
  // Get the file extension (e.g. '.png')
  const ext = path.extname(file.originalname).toLowerCase();
  
  // Only allow jpg, jpeg, and png images
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
    return cb(new Error('Only JPG, JPEG, or PNG images are allowed!'), false);
  }
  
  // Approve the file
  cb(null, true);
};

// 3. Initialize multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // Limit file size to 2MB (2 * 1024 * 1024 bytes)
  },
});

export default upload;
