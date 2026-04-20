import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  
},
{
  timestamps: true
});

const Post = mongoose.model('Post', postSchema, 'posts');

export default Post;
