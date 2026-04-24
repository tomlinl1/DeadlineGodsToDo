import mongoose from "mongoose";

const userAchievementSchema = new mongoose.Schema({
  achievement_ID: { type: String, required: true }, // match achievement.id (string)
  completed: { type: Boolean, default: false },
  completed_at: { type: Date }
});

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  
  total_points: { type: Number, default: 0 },
  total_tasks: { type: Number, default: 0 },
  total_tasks_low: { type: Number, default: 0 },
  total_tasks_medium: { type: Number, default: 0 },
  total_tasks_high: { type: Number, default: 0 },
  achievements: [userAchievementSchema],
  customization: {
    activeTheme: { type: String, default: "default" },
    unlockedThemes: { type: [String], default: ["default"] }
  }
}, { collection: "users" });

export default mongoose.model("User", userSchema);