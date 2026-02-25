import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ["profile", "streak", "tasks"],
    required: true
  },
  points: { type: Number, required: true }
},
{ collection: "achievements" });

//module.exports = mongoose.model("Achievement", achievementSchema);
export default mongoose.model("Achievement", achievementSchema);