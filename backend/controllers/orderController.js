const db = require('../config/database');

// Create order
exports.createOrder = async (req, res) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const { items, shipping_address, payment_method } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No items in order'
            });
        }

        // Calculate total
        let total = 0;
        for (const item of items) {
            const [products] = await connection.query(
                'SELECT price, stock FROM products WHERE id = ?',
                [item.product_id]
            );

            if (products.length === 0) {
                await connection.rollback();
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.product_id} not found`
                });
            }

            if (products[0].stock < item.quantity) {
                await connection.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product ${item.product_id}`
                });
            }

            total += products[0].price * item.quantity;
        }

        // Create order
        const [orderResult] = await connection.query(
            `INSERT INTO orders (user_id, total_amount, shipping_address, payment_method)
             VALUES (?, ?, ?, ?)`,
            [req.userId, total, shipping_address, payment_method]
        );

        const orderId = orderResult.insertId;

        // Insert order items and update stock
        for (const item of items) {
            const [products] = await connection.query(
                'SELECT price FROM products WHERE id = ?',
                [item.product_id]
            );

            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, products[0].price]
            );

            await connection.query(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        // Clear user cart
        await connection.query('DELETE FROM cart WHERE user_id = ?', [req.userId]);

        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            orderId,
            total
        });
    } catch (error) {
        await connection.rollback();
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    } finally {
        connection.release();
    }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
    try {
        const [orders] = await db.query(
            `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
            [req.userId]
        );

        res.json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get order details
exports.getOrderDetails = async (req, res) => {
    try {
        const [orders] = await db.query(
            'SELECT * FROM orders WHERE id = ? AND user_id = ?',
            [req.params.id, req.userId]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const [items] = await db.query(
            `SELECT oi.*, p.name as product_name, p.image, p.brand 
             FROM order_items oi 
             JOIN products p ON oi.product_id = p.id 
             WHERE oi.order_id = ?`,
            [req.params.id]
        );

        res.json({
            success: true,
            order: {
                ...orders[0],
                items
            }
        });
    } catch (error) {
        console.error('Get order details error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
