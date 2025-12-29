const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middleware/auth');

// All order routes require authentication
router.post('/', verifyToken, orderController.createOrder);
router.get('/', verifyToken, orderController.getUserOrders);
router.get('/:id', verifyToken, orderController.getOrderDetails);

module.exports = router;
