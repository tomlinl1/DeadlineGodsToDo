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
  achievements: [userAchievementSchema],
  customization: {
    font: { type: String, default: "Arial" },
    unlockedFonts: { type: [String], default: ["Arial"] }
  }
}, { collection: "users" });

export default mongoose.model("User", userSchema);