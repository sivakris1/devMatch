// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {createServer} from 'http'
import {Server} from 'socket.io'
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import developerRoutes from './routes/developers.js';
import Message from './models/Message.js';

dotenv.config();
connectDB();

console.log('🔥 CORRECT SERVER.JS IS RUNNING 🔥');


const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer,{
  cors : {origin : '*'}
})
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/developers', developerRoutes);

// Socket.io
io.on('connection', (socket)=>{
  console.log('User Connected:', socket.id)

  //User joins private room
  socket.on('join_room', (roomId) => {
    socket.join(roomId)
    console.log(`socket ${socket.id} joined room: ${roomId}`)
  })

  //User sends a message
  socket.on('send_message', async(data) => {

    try {
      const newMessage = await Message.create({
        roomId : data.roomId,
        senderId : data.senderId,
        receiverId : data.receiverId,
        message : data.message
      })

      io.to(data.roomId).emit('receive_message',{
        _id : newMessage._id,
        roomId : newMessage.roomId,
        senderId: data.senderId,
        message : newMessage.message,
        createdAt : newMessage.createdAt
      })
    } catch (err) {
      console.log('Message save error:', err)
    }
  })

  socket.on('disconnect', ()=> {
    console.log('User disconnected:', socket.id)
  })

})

app.get('/', (req, res) => {
  res.json({ message: 'DevMatch API is running with ES6!' });
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
