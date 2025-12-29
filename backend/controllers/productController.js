const db = require('../config/database');

// Get all products with filters
exports.getAllProducts = async (req, res) => {
    try {
        const { category, gender, brand, minPrice, maxPrice, search } = req.query;
        let query = 'SELECT * FROM products WHERE 1=1';
        const params = [];

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }
        if (gender) {
            query += ' AND (gender = ? OR gender = "unisex")';
            params.push(gender);
        }
        if (brand) {
            query += ' AND brand = ?';
            params.push(brand);
        }
        if (minPrice) {
            query += ' AND price >= ?';
            params.push(parseFloat(minPrice));
        }
        if (maxPrice) {
            query += ' AND price <= ?';
            params.push(parseFloat(maxPrice));
        }
        if (search) {
            query += ' AND (name LIKE ? OR description LIKE ? OR brand LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        query += ' ORDER BY created_at DESC';

        const [products] = await db.query(query, params);

        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get single product
exports.getProduct = async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            product: products[0]
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Create product (admin only - implement admin check later)
exports.createProduct = async (req, res) => {
    try {
        const {
            name, brand, price, original_price, discount, rating, reviews,
            image, gender, category, strap_type, dial_color, movement,
            description, stock
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO products (name, brand, price, original_price, discount, rating, reviews,
             image, gender, category, strap_type, dial_color, movement, description, stock)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, brand, price, original_price, discount, rating || 0, reviews || 0,
                image, gender, category, strap_type, dial_color, movement, description, stock || 0]
        );

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            productId: result.insertId
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = [];
        const values = [];

        // Build dynamic update query
        Object.keys(req.body).forEach(key => {
            updates.push(`${key} = ?`);
            values.push(req.body[key]);
        });

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        values.push(id);
        await db.query(
            `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        res.json({
            success: true,
            message: 'Product updated successfully'
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
