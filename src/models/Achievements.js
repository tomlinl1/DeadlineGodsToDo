import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  id: {type: String, required: true},
  name: {type: String, required: true},
  description: {type: String, required: true},
  category: {type: String, enum: ["profile", "streak", "tasks"], required: true},
  points: {type: Number, required: true}
})

const Achievements = mongoose.model('Achievements', achievementSchema, 'global_achievements');

export default Achievements;
