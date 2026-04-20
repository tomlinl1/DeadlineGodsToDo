import express from "express";
import User from "../models/User.js";
import Achievement from "../models/Achievement.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {

    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "user_id required" });
    }

    let user = await User.findOne({ user_id });

    if (!user) {

      const achievements = await Achievement.find();

      const userAchievements = achievements.map(a => ({
        achievement_ID: a.id,
        completed: false,
        completed_at: null
      }));

      user = new User({
        user_id,
        achievements: userAchievements,
        total_points: 0,
        total_tasks: 0,
        customization: {
          font: "Arial"
        }
      });

      await user.save();
    }

    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;