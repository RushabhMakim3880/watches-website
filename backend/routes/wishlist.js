const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { verifyToken } = require('../middleware/auth');

// All wishlist routes require authentication
router.get('/', verifyToken, wishlistController.getWishlist);
router.post('/', verifyToken, wishlistController.addToWishlist);
router.delete('/:id', verifyToken, wishlistController.removeFromWishlist);

module.exports = router;
