const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};

// Validation rules
const validationRules = {
    register: [
        body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
        body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    login: [
        body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    updateProfile: [
        body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
        body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
        body('address').optional().trim()
    ],
    newsletter: [
        body('email').isEmail().normalizeEmail().withMessage('Invalid email address')
    ],
    contact: [
        body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
        body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
        body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
    ]
};

module.exports = { validate, validationRules };
