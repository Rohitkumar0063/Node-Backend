const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const {
  createTask,
  getAllTasks,
  getOneTask,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');

// all task routes require authentication
router.use(protect);

router.post('/', createTask);
router.get('/', getAllTasks);
router.get('/:id', getOneTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
