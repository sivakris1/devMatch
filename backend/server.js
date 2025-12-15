// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import developerRoutes from './routes/developers.js';

dotenv.config();
connectDB();

console.log('🔥 CORRECT SERVER.JS IS RUNNING 🔥');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/developers', developerRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'DevMatch API is running with ES6!' });
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
