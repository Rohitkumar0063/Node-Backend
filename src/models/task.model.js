const mongoose = require('mongoose');

// schema for a single task
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    due_date: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    // we storing the postgres user id here to link tasks to users
    owner_id: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
