# DevMatch MVP – Developer Matching Platform

DevMatch is a **full-stack MVP** that helps developers discover and connect with other developers based on **skills, experience, and location**.

This project focuses on **core functionality**, not UI polish.

---

## 🚀 Features

### 🔐 Authentication
- User registration & login using JWT
- Protected routes for authenticated users

### 👤 Profile Management
- View & edit developer profile
- Manage:
  - Skills
  - Experience level
  - Location
  - Bio
  - GitHub, LinkedIn, Portfolio (optional)

### 🧑‍💻 Developer Discovery
- **Recommended Developers**
  - Skill-overlap based matching
  - Sorted by relevance
- **Search Developers**
  - Filter by skills, experience, and location
- **Public Developer Profiles**
  - View other developers’ profiles

> ⚠️ Pagination logic exists in backend but is intentionally disabled in frontend for MVP stability.

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt

### Frontend
- React
- React Router
- Axios
- Inline styling (design is not the focus)

---

## 📁 Project Structure

devmatch/
├── backend/
│ ├── models/
│ │ └── User.js
│ ├── routes/
│ │ ├── auth.js
│ │ ├── profile.js
│ │ └── developers.js
│ ├── middleware/
│ │ └── auth.js
│ ├── server.js
│ └── .env
│
├── frontend/
│ ├── pages/
│ │ ├── LoginPage.jsx
│ │ ├── RegisterPage.jsx
│ │ ├── ProfilePage.jsx
│ │ ├── DevelopersPage.jsx
│ │ └── DevelopersProfile.jsx
│ ├── components/
│ │ └── ProtectedRoute.jsx
│ └── App.jsx
│
└── README.md

yaml
Copy code

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

---

### Backend Setup

```bash
cd backend
npm install
Create .env file:

env
Copy code
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devmatch
JWT_SECRET=your_jwt_secret
Run backend:

bash
Copy code
npm run dev
Frontend Setup
bash
Copy code
cd frontend
npm install
npm run dev
📚 API Overview
Authentication
Register

arduino
Copy code
POST /api/auth/register
Login

bash
Copy code
POST /api/auth/login
Profile
Get Profile

sql
Copy code
GET /api/profile
Authorization: Bearer <token>
Update Profile

bash
Copy code
PUT /api/profile
Authorization: Bearer <token>
Example payload:

json
Copy code
{
  "skills": ["React", "Node.js", "MongoDB"],
  "experienceLevel": "Expert",
  "bio": "Full-stack developer",
  "location": "India",
  "github": "https://github.com/username",
  "linkedin": "https://linkedin.com/in/username",
  "portfolio": "https://portfolio.com"
}
Developers
Recommended Developers

bash
Copy code
GET /api/developers/recommend
Search Developers

bash
Copy code
POST /api/developers/search
Payload:

json
Copy code
{
  "skills": ["React"],
  "experienceLevel": "Intermediate",
  "location": "India"
}
Public Developer Profile

bash
Copy code
GET /api/profile/:userId
🧠 Recommendation Logic
Fetch current user skills

Find developers with overlapping skills

Count overlaps

Sort by highest match

js
Copy code
skillOverlapCount =
  dev.skills.filter(skill =>
    currentUserSkills.some(
      mySkill => mySkill.toLowerCase() === skill.toLowerCase()
    )
  ).length;
🔮 Future Enhancements
Pagination (search & recommendations)

Messaging system

Profile image upload

GitHub API integration

Favorites / bookmarks

Improved UI/UX

Automated tests

🧑‍💻 Developer
Built with persistence by Siva Krishna

⭐ Star the repository if you found it useful.
