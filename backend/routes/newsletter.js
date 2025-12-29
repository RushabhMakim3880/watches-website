const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { validate, validationRules } = require('../middleware/validation');

// Subscribe to newsletter
router.post('/', validationRules.newsletter, validate, async (req, res) => {
    try {
        const { email } = req.body;

        // Check if already subscribed
        const [existing] = await db.query('SELECT id FROM newsletter WHERE email = ?', [email]);

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email already subscribed'
            });
        }

        // Subscribe
        await db.query('INSERT INTO newsletter (email) VALUES (?)', [email]);

        res.json({
            success: true,
            message: 'Successfully subscribed to newsletter'
        });
    } catch (error) {
        console.error('Newsletter error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Get all subscribers (admin only - add admin middleware later)
router.get('/', async (req, res) => {
    try {
        const [subscribers] = await db.query('SELECT * FROM newsletter ORDER BY subscribed_at DESC');

        res.json({
            success: true,
            count: subscribers.length,
            subscribers
        });
    } catch (error) {
        console.error('Get subscribers error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
