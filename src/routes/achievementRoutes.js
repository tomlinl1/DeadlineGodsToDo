import express from "express";
import User from "../models/User.js";
import Achievement from "../models/Achievement.js";

const router = express.Router();



// -----------------------------
// Get all achievements for a user
// -----------------------------
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch all achievements from your achievements collection
    const allAchievements = await Achievement.find();

    // Map user achievements to the achievement details
    const achievements = allAchievements.map(a => {
      // Match the user's achievement entry by achievement_ID
      const userAch = user.achievements.find(
        ua => ua.achievement_ID === a.id
      );

      return {
        id: a.id,
        name: a.name,
        description: a.description,
        category: a.category,
        points: a.points,
        completed: userAch ? userAch.completed : false,
      };
    });

    res.json(achievements);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------
// Mark an achievement as completed
// -----------------------------
router.post("/:userId/complete/:achievementId", async (req, res) => {
  try {
    const { userId, achievementId } = req.params;

    const user = await User.findOne({ user_id: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find user's achievement by achievement_ID
    let userAchievement = user.achievements.find(
      ua => ua.achievement_ID === achievementId
    );

    if (!userAchievement) {
      // If not present, add it
      userAchievement = {
        achievement_ID: achievementId,
        completed: true,
        completed_at: new Date()
      };
      user.achievements.push(userAchievement);
    } else {
      if (userAchievement.completed) {
        return res.status(400).json({ message: "Achievement already completed" });
      }
      userAchievement.completed = true;
      userAchievement.completed_at = new Date();
    }

    // Update totalPoints if achievement exists
    const achievement = await Achievement.findOne({ id: achievementId });
    if (achievement) user.totalPoints += Number(achievement.points);

    //Mapping achevements to a theme
    const themeUnlocks = {
      ach_01: "default",
      ach_02: "dark",
      ach_03: "ocean",
      ach_04: "sunset",
      ach_05: "discord"
    };

    const unlockedTheme = themeUnlocks[achievementId];

    if (unlockedTheme && !user.customization.unlockedThemes.includes(unlockedTheme)) {
      user.customization.unlockedThemes.push(unlockedTheme);
    }
    await user.save();

    res.json({ message: "Achievement completed", totalPoints: user.totalPoints });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;