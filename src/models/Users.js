import mongoose from 'mongoose';

const userAchievementSchema = new mongoose.Schema({
  achievement_ID: {type: String, required: true},
  completed: {type: Boolean, default: false},
  completed_at: {type: Date}
});

const userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  total_points: {type: Number, default: 0},
  achievements: [userAchievementSchema]
})

const Users = mongoose.model('Users', achievementSchema, 'users');

export default Users;
