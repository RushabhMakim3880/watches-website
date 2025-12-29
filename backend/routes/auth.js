const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { validate, validationRules } = require('../middleware/validation');

// Public routes
router.post('/register', validationRules.register, validate, authController.register);
router.post('/login', validationRules.login, validate, authController.login);

// Protected routes
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, validationRules.updateProfile, validate, authController.updateProfile);

module.exports = router;
