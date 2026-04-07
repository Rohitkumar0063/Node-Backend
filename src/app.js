const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

// allow cross-origin requests
app.use(cors());

// parse incoming JSON bodies
app.use(express.json());

// health check route
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running 🚀' });
});

// mount routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// catch requests to undefined routes
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found.` });
});

// global error handler must be the last middleware
app.use(errorHandler);

module.exports = app;
