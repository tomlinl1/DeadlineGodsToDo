import mongoose from "mongoose";

const userAchievementSchema = new mongoose.Schema({
  achievement_ID: { type: String, required: true }, // match achievement.id (string)
  completed: { type: Boolean, default: false },
  completed_at: { type: Date }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String },
  totalPoints: { type: Number, default: 0 },
  achievements: [userAchievementSchema]
}, { collection: "users" });

export default mongoose.model("User", userSchema);