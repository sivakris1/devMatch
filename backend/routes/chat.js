import express from 'express'
import Message from '../models/Message.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// ⚠️ /conversations MUST come before /:userId
// otherwise Express treats "conversations" as a userId param

// GET all conversations for current user
router.get('/conversations', auth, async (req, res) => {
  try {
    const myId = req.userId

    // Find all messages where I am sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: myId }, { receiverId: myId }]
    })
    .sort({ createdAt: -1 }) // newest first
    .populate('senderId', 'name')
    .populate('receiverId', 'name')

    // Group by roomId — keep only LAST message per room
    const seen = new Set()
    const conversations = []

    for (const msg of messages) {
      if (!seen.has(msg.roomId)) {
        seen.add(msg.roomId)

        // Figure out who the OTHER person is
        const otherUser = msg.senderId._id.toString() === myId.toString()
          ? msg.receiverId
          : msg.senderId

        conversations.push({
          roomId: msg.roomId,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          otherUser: {
            _id: otherUser._id,
            name: otherUser.name
          }
        })
      }
    }

    res.json({ success: true, data: conversations })

  } catch (err) {
    console.error('Conversations error:', err)
    res.status(500).json({ message: 'Failed to load conversations' })
  }
})

// GET old messages between two users
router.get('/:userId', auth, async (req, res) => {
  try {
    const myId = req.userId
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
