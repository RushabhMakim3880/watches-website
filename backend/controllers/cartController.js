const db = require('../config/database');

// Get user cart
exports.getCart = async (req, res) => {
    try {
        const [cartItems] = await db.query(
            `SELECT c.id, c.quantity, p.* 
             FROM cart c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ?`,
            [req.userId]
        );

        res.json({
            success: true,
            count: cartItems.length,
            cart: cartItems
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Add to cart
exports.addToCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;

        // Check if product exists
        const [products] = await db.query('SELECT id, stock FROM products WHERE id = ?', [product_id]);
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if already in cart
        const [existing] = await db.query(
            'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?',
            [req.userId, product_id]
        );

        if (existing.length > 0) {
            // Update quantity
            const newQuantity = existing[0].quantity + (quantity || 1);
            await db.query(
                'UPDATE cart SET quantity = ? WHERE id = ?',
                [newQuantity, existing[0].id]
            );
        } else {
            // Insert new cart item
            await db.query(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [req.userId, product_id, quantity || 1]
            );
        }

        res.json({
            success: true,
            message: 'Product added to cart'
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }

        await db.query(
            'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
            [quantity, id, req.userId]
        );

        res.json({
            success: true,
            message: 'Cart updated'
        });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
    try {
        await db.query(
            'DELETE FROM cart WHERE id = ? AND user_id = ?',
            [req.params.id, req.userId]
        );

        res.json({
            success: true,
            message: 'Item removed from cart'
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    try {
        await db.query('DELETE FROM cart WHERE user_id = ?', [req.userId]);

        res.json({
            success: true,
            message: 'Cart cleared'
        });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
