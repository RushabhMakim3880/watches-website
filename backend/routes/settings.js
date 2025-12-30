const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { verifyToken } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// Settings management
router.get('/', settingsController.getSettings);
router.put('/newsletter', settingsController.updateNewsletterPreference);
router.delete('/account', settingsController.deleteAccount);

module.exports = router;
