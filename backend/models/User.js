import mongoose from 'mongoose';
import bcrypt from 'bcryptjs' 

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim : true,
    minlength : [2, 'Name must be atleast 2 characters']
  },
    email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries by default
  },
  skills: [{
    type: String,
    trim: true,
    default: [] 
  }],
 experienceLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'  // Default to 'Beginner' instead of required: true
  },
  bio: {
    type: String,
    maxlength: 500
  },
  githubProfile: {
    type: String
  },
  portfolioUrl: {
    type: String
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

userSchema.pre('save',async function (next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12)
    next()
})

const User = mongoose.model('User', userSchema);
export default User;
