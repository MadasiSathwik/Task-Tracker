const Task = require('../models/Task');

const getTasks = async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
};

const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    data: task,
  });
};

const createTask = async (req, res) => {
  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    data: task,
  });
};

const updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    data: task,
  });
};

const deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
  });
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
