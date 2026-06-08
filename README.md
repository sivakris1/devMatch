# DevMatch 🚀 — Premium Developer Matching Platform

DevMatch is a premium, full-stack developer matching and collaboration platform. It helps developers discover, match, and instantly chat with other developers using a modern, fully responsive Glassmorphism UI, a real-time messaging suite with smart unread badges, and an **advanced Gemini AI Recommendation Matcher**.

---

## ✨ Features

### 🎨 1. Premium Glassmorphism UI
- **Modern Design System:** Tailored HSL color palettes, deep frosted glass backdrops (`backdrop-filter`), elegant borders, and premium modern typography (Inter, Outfit).
- **Vibrant Background Blobs:** Dynamic CSS-animated ambient gradients that move subtly in the background to provide a premium, state-of-the-art developer portal.
- **Micro-Animations:** Smooth transitions, active hover scales, and fade-in entries for all cards and pages.

### 🤖 2. Gemini AI Smart Matcher
- **Dynamic AI Recommendation Engine:** Leverages Gemini to analyze developer profiles (skills, experience, bio) and recommend the best team matches.
- **Detailed AI Analysis:** Returns a clear, natural-language explanation of *why* developers match and displays a dynamic percentage match score.
- **Interactive UI:** A dedicated **AI Match** tab that renders matched developers in rank order with conically gradient-tracked percentage badges.

### 💬 3. Real-Time Chat (Socket.io)
- **Instant Messaging:** Seamless, low-latency communication via Socket.io.
- **Floating Chat Windows:** Integrated, floating chat UI showing active online indicators, initials-based avatars, and speech bubbles.
- **Automated Scrolling:** Intuitive scrolling that automatically keeps track of new incoming messages.

### 🔴 4. Unread Notification Badges
- **Global Badge:** A real-time count in the navigation header showing total unread messages.
- **Per-Conversation WhatsApp-Style Badges:** The chat inbox displays real-time counter badges next to each user who has messaged you.
- **Instant State Clearing:** Clicking on a conversation instantly triggers an API update and resets the local count badge to 0 for a seamless user experience.
- **Active Window Silencing:** While actively messaging someone inside an open chat window, incoming messages from that user are marked as read instantly without bloating the inbox counters.

### 🔍 5. Skill Autocomplete & Advanced Search
- **Search Engine:** Filter and query developers by skill tags, experience tiers (Beginner, Intermediate, Advanced, Expert), and geographical location.
- **Interactive Skill Autocomplete:** Modern component for tag selection and profile skills editing.

### 💳 6. Secure Razorpay Payment Gateway
- **Razorpay Integration:** Full-stack integration with order generation and client checkout using Razorpay Test Mode.
- **HMAC Signature Verification:** Prevents payment faking using cryptographic verification on the backend.
- **Premium Upgrades:** Automatically updates user accounts to Premium, unlocking exclusive features.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite-powered, super-fast hot module reloading)
- **React Router Dom v6** (Client-side routing)
- **Axios** (Robust API client intercepting headers)
- **Socket.io-client** (Real-time duplex connections)
- **Vanilla CSS** (Dynamic styling, variables, glassmorphism, responsive grids)

### Backend
- **Node.js** & **Express.js** (REST API)
- **MongoDB** & **Mongoose** (Document database and schema validation)
- **Socket.io** (WebSocket orchestration)
- **JSON Web Tokens (JWT)** (Secure stateless authentication)
- **Bcrypt.js** (Secure industry-standard password hashing)

---

## 📁 Project Structure

```text
devmatch/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Message.js
│   │   └── User.js
│   ├── routes/
│   │   ├── ai.js
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── payment.js
│   │   └── profile.js
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js
│   │   │   ├── socket.js
│   │   │   └── UiContext.jsx
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── SkillInput.jsx
│   │   ├── pages/
│   │   │   ├── DevelopersPage.jsx
│   │   │   ├── DevelopersProfile.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MessagesPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.css
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0.0 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local MongoDB instance

### 1. Clone the repository
```bash
git clone https://github.com/your-username/devmatch.git
cd devmatch
```

### 2. Backend Setup
1. Navigate into backend:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` root directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   GEMINI_API_KEY=your_gemini_api_token
   ```
4. Run the server in development mode:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend/vite-project
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## 🧑‍💻 Developer
Built with ❤️ and dedication by **Siva Krishna**.

⭐ **Star the repository if you love this platform!**
