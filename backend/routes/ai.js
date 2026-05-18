import express from 'express'
import User from '../models/User.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// Smart matching algorithm
const calculateMatch = (currentUser, developer) => {
  let score = 0
  const reasons = []

  // 1. Skill overlap (max 50 points)
  const mySkills = currentUser.skills.map(s => s.toLowerCase())
  const theirSkills = developer.skills.map(s => s.toLowerCase())
  const sharedSkills = mySkills.filter(s => theirSkills.includes(s))
  const skillScore = Math.min(50, sharedSkills.length * 15)
  score += skillScore

  if (sharedSkills.length > 0) {
    reasons.push(`You both know ${sharedSkills.slice(0, 3).join(', ')} — great foundation for collaboration.`)
  }

  // 2. Complementary skills (max 20 points)
  const uniqueTheirSkills = theirSkills.filter(s => !mySkills.includes(s))
  if (uniqueTheirSkills.length > 0) {
    score += Math.min(20, uniqueTheirSkills.length * 5)
    reasons.push(`${developer.name} brings ${uniqueTheirSkills.slice(0, 2).join(', ')} skills that complement your stack.`)
  }

  // 3. Experience level compatibility (max 20 points)
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  const myLevel = levels.indexOf(currentUser.experienceLevel)
  const theirLevel = levels.indexOf(developer.experienceLevel)
  const diff = Math.abs(myLevel - theirLevel)

  if (diff === 0) {
    score += 20
    reasons.push(`Same experience level — you're at equal footing, perfect for peer learning.`)
  } else if (diff === 1) {
    score += 15
    reasons.push(`Close experience levels mean you can learn from each other effectively.`)
  } else if (diff === 2) {
    score += 8
    reasons.push(`${developer.name} can mentor you or learn from your perspective.`)
  }

  // 4. Both have bio (max 10 points)
  if (currentUser.bio && developer.bio) {
    score += 10
    reasons.push(`Both have detailed profiles — shows commitment to the community.`)
  }

  // Ensure score is between 0-100
  score = Math.min(100, Math.max(0, score))

  // Build final reason (pick best 2)
  const finalReason = reasons.slice(0, 2).join(' ') || 
    `${developer.name} has an interesting profile worth exploring.`

  return { score, reason: finalReason }
}

router.get('/recommend', auth, async (req, res) => {
  try {
    // Get current user
    const currentUser = await User.findById(req.userId)
    if (!currentUser) return res.status(404).json({ message: 'User not found' })

    // Get other developers
    const developers = await User.find({ _id: { $ne: req.userId } })
      .select('name skills experienceLevel bio location')
      .limit(10)

    if (developers.length === 0) {
      return res.json({ success: true, data: [] })
    }

    // Calculate match for each developer
    const recommendations = developers
      .map(dev => {
        const { score, reason } = calculateMatch(currentUser, dev)
        return {
          developerId: dev._id,
          matchScore: score,
          reason,
          developer: dev
        }
      })
      .sort((a, b) => b.matchScore - a.matchScore) // highest first

    res.json({ success: true, data: recommendations })

  } catch (err) {
    console.error('Recommend error:', err)
    res.status(500).json({ message: 'Recommendation failed', error: err.message })
  }
})

export default router
