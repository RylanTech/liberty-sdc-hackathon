const express = require('express');
const { body } = require('express-validator');
const { signup, signin, verifyToken, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Validation rules
const signupValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
];

const signinValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Routes
// POST /auth/signup - Register a new user
router.post('/signup', signupValidation, signup);

// POST /auth/signin - Sign in user
router.post('/signin', signinValidation, signin);

// GET /auth/verify - Verify token and get user info
router.get('/verify', authMiddleware, verifyToken);

// GET /auth/profile - Get user profile (protected route)
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
