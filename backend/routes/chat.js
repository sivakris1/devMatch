import express from 'express'
import Message from '../models/Message.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// ⚠️ /conversations MUST come before /:userId
// otherwise Express treats "conversations" as a userId param

//GET unread msgs count of specific user
router.get('/unread-count', auth, async(req,res)=>{

  try {
    const count = await Message.countDocuments({
      receiverId : req.userId,
      read : false
    })

    res.json({success : true, count})
  } catch (error) {
      res.status(500).json({ message: 'Failed to get unread count' })
  }
})

//update the read to true when user reads the received msgs
router.put('/mark-read/:userId', auth, async(req,res)=>{

  try {
    await Message.updateMany(
      {senderId : req.params.userId, receiverId: req.userId, read : false},
      {$set : {read : true}}
    )

    res.json({success : true})
  } catch (error) {
      res.status(500).json({ message: 'Failed to mark as read' })
  }
})


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

        const unreadCount = await Message.countDocuments({
          senderId: otherUser._id,
          receiverId: myId,
          read: false
        })

        conversations.push({
          roomId: msg.roomId,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unreadCount,
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
