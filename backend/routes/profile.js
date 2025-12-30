const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes require authentication
router.use(verifyToken);

// Profile management
router.put('/', profileController.updateProfile);
router.post('/picture', upload.single('profilePicture'), profileController.uploadProfilePicture);
router.put('/password', profileController.changePassword);

// Address management
router.get('/addresses', profileController.getAddresses);
router.post('/addresses', profileController.addAddress);
router.put('/addresses/:id', profileController.updateAddress);
router.delete('/addresses/:id', profileController.deleteAddress);
router.put('/addresses/:id/default', profileController.setDefaultAddress);

module.exports = router;
