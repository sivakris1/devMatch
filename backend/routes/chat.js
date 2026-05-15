import express from 'express'
import Message from '../models/Message.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// GET old messages between two users
router.get('/:userId', verifyToken, async (req, res) => {
  try {
    const myId = req.user.id
    const theirId = req.params.userId
    
    // Create same roomId as frontend
    const roomId = [myId, theirId].sort().join('_')

    // Get all messages in this room, oldest first
    const messages = await Message.find({ roomId })
      .sort({ createdAt: 1 })
      .populate('senderId', 'name')

    res.json({ success: true, data: messages })

  } catch (err) {
    res.status(500).json({ message: 'Failed to load messages' })
  }
})

export default router
