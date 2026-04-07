const Task = require('../models/task.model');
const { createTaskValidator, updateTaskValidator } = require('../validators');
const { createError } = require('../middleware/error.middleware');

// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { error, value } = createTaskValidator.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({ message: 'Validation failed', errors: messages });
    }

    const task = await Task.create({
      ...value,
      owner_id: req.user.id, // link task to the logged-in user
    });

    res.status(201).json({ message: 'Task created!', task });
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks
const getAllTasks = async (req, res, next) => {
  try {
    // only return tasks that belong to this user
    const tasks = await Task.find({ owner_id: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ count: tasks.length, tasks });
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks/:id
const getOneTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(createError('Task not found.', 404));
    }

    // make sure this task belongs to the current user
    if (task.owner_id !== req.user.id) {
      return next(createError('You are not allowed to access this task.', 403));
    }

    res.status(200).json({ task });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const { error, value } = updateTaskValidator.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({ message: 'Validation failed', errors: messages });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(createError('Task not found.', 404));
    }

    // security check — user can only edit their own tasks
    if (task.owner_id !== req.user.id) {
      return next(createError('You are not allowed to modify this task.', 403));
    }

    // apply the updates
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: value },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Task updated!', task: updatedTask });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(createError('Task not found.', 404));
    }

    // security check — user can only delete their own tasks
    if (task.owner_id !== req.user.id) {
      return next(createError('You are not allowed to delete this task.', 403));
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTask, getAllTasks, getOneTask, updateTask, deleteTask };
