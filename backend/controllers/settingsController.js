const db = require('../config/database');

// Update newsletter subscription
exports.updateNewsletterPreference = async (req, res) => {
    try {
        const userId = req.userId;
        const { subscribed } = req.body;

        if (subscribed === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Subscription status is required'
            });
        }

        await db.query(
            'UPDATE users SET newsletter_subscribed = ? WHERE id = ?',
            [subscribed ? 1 : 0, userId]
        );

        res.json({
            success: true,
            message: `Newsletter ${subscribed ? 'subscribed' : 'unsubscribed'} successfully`
        });
    } catch (error) {
        console.error('Update newsletter preference error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get user settings
exports.getSettings = async (req, res) => {
    try {
        const userId = req.userId;
        const [users] = await db.query(
            'SELECT newsletter_subscribed FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            settings: {
                newsletterSubscribed: users[0].newsletter_subscribed === 1
            }
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Delete account
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.userId;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required to delete account'
            });
        }

        // Get user to verify password
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = users[0];
        const bcrypt = require('bcryptjs');
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect password'
            });
        }

        // Delete user (cascade will delete related data)
        await db.query('DELETE FROM users WHERE id = ?', [userId]);

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
