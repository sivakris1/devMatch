import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req,res) =>{
      res.json({ message: 'DevMatch API is running with ES6!' });
})

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
})