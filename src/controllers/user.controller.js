const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/postgres');
const { registerValidator, loginValidator } = require('../validators');
const { createError } = require('../middleware/error.middleware');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    // validate the incoming data
    const { error, value } = registerValidator.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({ message: 'Validation failed', errors: messages });
    }

    const { email, password } = value;

    // check if email already exists
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return next(createError('An account with this email already exists.', 409));
    }

    // hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    // save to postgres
    const result = await db.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, hashedPassword]
    );

    const newUser = result.rows[0];

    res.status(201).json({
      message: 'Account created successfully!',
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { error, value } = loginValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = value;

    // find user by email
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return next(createError('Invalid email or password.', 401));
    }

    // compare password with the stored hash
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return next(createError('Invalid email or password.', 401));
    }

    // create and sign the JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me  (protected)
const getProfile = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = result.rows[0];
    if (!user) {
      return next(createError('User not found.', 404));
    }

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getProfile };
