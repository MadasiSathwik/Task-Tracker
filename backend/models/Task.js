const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Completed'],
        message: '{VALUE} is not a valid status. Use Pending or Completed.',
      },
      default: 'Pending',
    },
    category: {
      type: String,
      enum: {
        values: ['Todo', 'Doing', 'Upcoming'],
        message: '{VALUE} is not a valid category. Use Todo, Doing, or Upcoming.',
      },
      default: 'Todo',
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: '{VALUE} is not a valid priority. Use Low, Medium, or High.',
      },
      default: 'Medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Task', taskSchema);
