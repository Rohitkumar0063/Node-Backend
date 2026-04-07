const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/user.controller');
const protect = require('../middleware/auth.middleware');

// public routes
router.post('/register', register);
router.post('/login', login);

// protected route — must be logged in
router.get('/me', protect, getProfile);

module.exports = router;
