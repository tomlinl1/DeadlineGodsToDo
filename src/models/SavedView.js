import mongoose from 'mongoose';

const savedViewSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: { 
    type: String, 
    default: '' },
  filters: {
    tag: { type: String, default: '' },
    priority: { type: String, default: '' },
    dateFrom: { type: String, default: '' },
    dateTo: { type: String, default: '' },
    search: { type: String, default: '' },
  },
  sortBy: {
    type: String,
    enum: ['date', 'title', 'priority'],
    default: 'date',
  },
  sortOrder: {
    type: String,
    enum: ['asc', 'desc'],
    default: 'asc',
  },
  pinned: {
    type: Boolean,
    default: false,
  },
});

const SavedView = mongoose.model('SavedView', savedViewSchema, 'savedviews');

export default SavedView;
