DevMatch MVP - Developer Matching Platform Backend
A RESTful API backend for connecting developers based on skills, experience, and location. Built with Node.js, Express, and MongoDB.

🚀 Features
User Authentication - JWT-based registration and login system
Profile Management - Complete user profile CRUD operations
Developer Discovery - Three powerful ways to find developers:
List All Developers - Paginated listing of all registered developers
Advanced Search - Filter by skills, experience level, and location
Smart Recommendations - AI-powered skill overlap matching algorithm
🛠️ Tech Stack
Runtime: Node.js
Framework: Express.js
Database: MongoDB with Mongoose ODM
Authentication: JWT (JSON Web Tokens)
Password Security: bcryptjs
Environment: dotenv
Development: nodemon
📁 Project Structure
devmatch-mvp/
├── backend/
│   ├── models/
│   │   └── User.js          # User schema with skills, experience, location
│   ├── routes/
│   │   ├── auth.js          # Authentication endpoints
│   │   ├── profile.js       # Profile management endpoints
│   │   └── developers.js    # Developer discovery endpoints
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── server.js            # Main server file
│   ├── test-api.js          # API testing script
│   ├── package.json         # Dependencies and scripts
│   └── .env                 # Environment variables
└── README.md                # This file
⚙️ Installation & Setup
Prerequisites
Node.js (v14 or higher)
MongoDB (local or MongoDB Atlas)
npm or yarn
Steps
Clone the repository

git clone <repository-url>
cd devmatch-mvp/backend
Install dependencies

npm install
Set up environment variables Create a .env file in the backend directory:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/devmatch
JWT_SECRET=your_super_secret_jwt_key_here
Start MongoDB

Local: mongod
Or use MongoDB Atlas cloud database
Run the server

# Development mode (with nodemon)
npm run dev

# Production mode
npm start
Test the API

node test-api.js
📚 API Endpoints
Authentication
Register User
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
Login User
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
Profile Management
Get User Profile
GET /api/profile
Authorization: Bearer <jwt_token>
Update User Profile
PUT /api/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "bio": "Full-stack developer with 5 years experience",
  "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
  "experienceLevel": "intermediate",
  "location": "San Francisco, CA",
  "githubUrl": "https://github.com/johndoe",
  "linkedinUrl": "https://linkedin.com/in/johndoe"
}
Developer Discovery
List All Developers
GET /api/developers?page=1&limit=10
Authorization: Bearer <jwt_token>
Search Developers
GET /api/developers/search?skills=React&experienceLevel=intermediate&location=San Francisco
Authorization: Bearer <jwt_token>
Get Recommended Developers
GET /api/developers/recommend?page=1&limit=5
Authorization: Bearer <jwt_token>
🔧 Environment Variables
Variable	Description	Example
PORT	Server port number	5000
MONGODB_URI	MongoDB connection string	mongodb://localhost:27017/devmatch
JWT_SECRET	Secret key for JWT tokens	your_super_secret_key
📖 Usage Examples
Using cURL
Register a new user:

curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Smith","email":"jane@example.com","password":"password123"}'
Get recommendations:

curl -X GET "http://localhost:5000/api/developers/recommend?page=1&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
Response Format
All API responses follow this consistent format:

{
  "success": true,
  "data": {
    "developers": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalCount": 25,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
🧠 Recommendation Algorithm
The smart recommendation system works by:

Skill Extraction - Gets current user’s skills from their profile
MongoDB Query - Uses $in operator to find developers with overlapping skills
Overlap Calculation - Counts matching skills between users (case-insensitive)
Relevance Sorting - Sorts developers by skill overlap count (highest first)
Pagination - Applies pagination to the sorted results
// Core algorithm snippet
const developers = await User.find({
  _id: { $ne: req.user._id },
  skills: { $in: currentUserSkills }
});

const developersWithScore = developers.map(dev => ({
  ...dev,
  skillOverlapCount: dev.skills.filter(skill => 
    currentUserSkills.some(userSkill => 
      userSkill.toLowerCase() === skill.toLowerCase()
    )
  ).length
}));

🔮 Future Enhancements
Real-time Messaging - WebSocket integration for developer communication
Project Collaboration - Create and manage collaborative projects
Skill Verification - GitHub integration for skill validation
Advanced Matching - Machine learning for better recommendations
Geolocation - Distance-based developer discovery
Rating System - Peer reviews and ratings
Email Notifications - Match alerts and updates
File Upload - Profile pictures and resume uploads
API Rate Limiting - Prevent abuse and ensure fair usage
Comprehensive Testing - Unit and integration test suites
🤝 Contributing
Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Developer
Built with ❤️ by [Siva Krishna] 

⭐ Star this repository if you found it helpful!