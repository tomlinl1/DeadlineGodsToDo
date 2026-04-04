import mongoose from 'mongoose';

// Represents an entry on the calendar. Fields match the structure in calendar-data.js:
// - task_id (Number, sequential, using the existing counter helper)
// - user_id (Number, required)
// - start_date (Date, required)
// - end_date (Date, optional, null means single-day event)
// - name (String, task/title shown on calendar)
// - priority (Number, 1-3, higher = more important)
// - link (String, null for now, could be used in future)

const calendarTaskSchema = new mongoose.Schema({
  task_id: {
    type: Number,
    required: true,
  },
  user_id: {
    type: Number,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    default: null,
  },
  title: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    enum: [1, 2, 3],
    default: 1,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// Use the `tasks` collection explicitly
const CalendarTask = mongoose.model('CalendarTask', calendarTaskSchema, 'tasks');

export default CalendarTask;