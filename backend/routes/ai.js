import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/User";
import auth from "../middleware/auth";

const router = express.router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get("/recommend", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser)
      return res.status(404).json({ message: "User not found" });

    const developers = await User.find({ _id: { $ne: req.userId } })
      .select("name skills experienceLevel bio location")
      .limit(10);

    if (developers.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const prompt = `
You are a developer matching AI for DevMatch, a developer networking platform.

CURRENT USER PROFILE:
Name : ${currentUser.name}
Skills : ${currentUser.skills.join(", ") || "None listed"}
Experience : ${currentUser.experienceLevel || "None listed"}
Bio : ${currentUser.bio || "No bio"}

AVAILABLE DEVELOPERS TO MATCH:
${developers
  .map(
    (dev, i) => `
    ${i + 1}. ID: ${dev._id}
    Name : ${dev.name}
    Skills: ${dev.skills.join(", ") || "None"}
    Experience: ${dev.experienceLevel || "Not specified"}
    Bio: ${dev.bio || "No bio"}
  `,
  )
  .join("")}


  TASK:
Rank these developers by compatibility with the current user.
Consider: shared skills, complementary skills, experience level match, collaboration potential.
Respond in VALID JSON only. No extra text. No markdown. Just JSON:
{
  "recommendations": [
    {
      "developerId": "exact_id_from_above",
      "matchScore": 92,
      "reason": "2-3 sentence explanation of why they match well"
    }
  ]
}

`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    //parsing response of gemini
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const enriched = parsed.recommendations
      .map((rec) => {
        const dev = developers.find(
          (d) => d._id.toString() === rec.developerId,
        );

        return {
          ...rec,
          developer: dev,
        };
      })
      .filter((rec) => rec.developer); // remove any that didn't match

       res.json({ success: true, data: enriched });

  } catch (err) {
    console.error("AI Recommend error:", err);
    res
      .status(500)
      .json({ message: "AI recommendation failed", error: err.message });
  }
});

export default router
