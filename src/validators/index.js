const Joi = require('joi');

// validator for user registration
const registerValidator = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
});

// validator for user login
const loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// validator for creating a new task
const createTaskValidator = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    'any.required': 'Task title is required',
  }),
  description: Joi.string().max(1000).optional().allow(''),
  due_date: Joi.date().iso().optional().allow(null).messages({
    'date.format': 'Due date must be in ISO format (e.g. 2024-12-31)',
  }),
  status: Joi.string().valid('pending', 'completed').optional(),
});

// validator for updating a task (all fields are optional)
const updateTaskValidator = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  description: Joi.string().max(1000).optional().allow(''),
  due_date: Joi.date().iso().optional().allow(null),
  status: Joi.string().valid('pending', 'completed').optional(),
}).min(1); // at least one field must be present

module.exports = {
  registerValidator,
  loginValidator,
  createTaskValidator,
  updateTaskValidator,
};
