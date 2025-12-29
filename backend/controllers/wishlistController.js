const db = require('../config/database');

// Get user wishlist
exports.getWishlist = async (req, res) => {
    try {
        const [wishlistItems] = await db.query(
            `SELECT w.id, p.* 
             FROM wishlist w 
             JOIN products p ON w.product_id = p.id 
             WHERE w.user_id = ?`,
            [req.userId]
        );

        res.json({
            success: true,
            count: wishlistItems.length,
            wishlist: wishlistItems
        });
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { product_id } = req.body;

        // Check if product exists
        const [products] = await db.query('SELECT id FROM products WHERE id = ?', [product_id]);
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if already in wishlist
        const [existing] = await db.query(
            'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
            [req.userId, product_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Product already in wishlist'
            });
        }

        // Insert into wishlist
        await db.query(
            'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
            [req.userId, product_id]
        );

        res.json({
            success: true,
            message: 'Product added to wishlist'
        });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        await db.query(
            'DELETE FROM wishlist WHERE id = ? AND user_id = ?',
            [req.params.id, req.userId]
        );

        res.json({
            success: true,
            message: 'Item removed from wishlist'
        });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
