import mongoose from 'mongoose';

// Represents an entry on the calendar.  Fields mirror the comment
// in `calendar.ejs`:
//  - _id              : Number (sequential, using the existing counter helper)
//  - startDate        : Date (required)
//  - endDate          : Date (optional, null means single-day event)
//  - name             : String (task/title shown on calendar)
//  - priority         : Number (1-3, higher = more important)
//  - link             : String (null for now, could be used in future based on how tasks are implemented)

const calendarTaskSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    enum: [1, 2, 3],
    default: 1,
  },
  link: {
    type: String,
    default: null,
  },
});

// use the `calendarTasks` collection explicitly if desired
const CalendarTask = mongoose.model('CalendarTask', calendarTaskSchema, 'tasks');

export default CalendarTask;
