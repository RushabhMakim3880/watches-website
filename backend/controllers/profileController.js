const db = require('../config/database');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Update profile information
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, address } = req.body;

        const updates = [];
        const values = [];

        if (name) {
            updates.push('name = ?');
            values.push(name);
        }
        if (phone !== undefined) {
            updates.push('phone = ?');
            values.push(phone);
        }
        if (address !== undefined) {
            updates.push('address = ?');
            values.push(address);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        values.push(userId);
        await db.query(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        // Get updated user
        const [users] = await db.query('SELECT id, name, email, phone, address, profile_picture FROM users WHERE id = ?', [userId]);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: users[0]
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.userId;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const profilePicturePath = `/uploads/${req.file.filename}`;

        // Get old profile picture
        const [users] = await db.query('SELECT profile_picture FROM users WHERE id = ?', [userId]);
        const oldPicture = users[0]?.profile_picture;

        // Update database
        await db.query('UPDATE users SET profile_picture = ? WHERE id = ?', [profilePicturePath, userId]);

        // Delete old picture if exists
        if (oldPicture && oldPicture !== '/uploads/default-avatar.png') {
            const oldPath = path.join(__dirname, '..', '..', oldPicture);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        res.json({
            success: true,
            message: 'Profile picture uploaded successfully',
            profilePicture: profilePicturePath
        });
    } catch (error) {
        console.error('Upload profile picture error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const userId = req.userId;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        // Get user
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = users[0];

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get all addresses
exports.getAddresses = async (req, res) => {
    try {
        const userId = req.userId;
        const [addresses] = await db.query(
            'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
            [userId]
        );

        res.json({
            success: true,
            addresses
        });
    } catch (error) {
        console.error('Get addresses error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Add new address
exports.addAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const { label, fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = req.body;

        // If this is set as default, unset other defaults
        if (isDefault) {
            await db.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [userId]);
        }

        const [result] = await db.query(
            `INSERT INTO addresses (user_id, label, full_name, phone, address_line1, address_line2, city, state, pincode, is_default)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, label, fullName, phone, addressLine1, addressLine2 || null, city, state, pincode, isDefault ? 1 : 0]
        );

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            addressId: result.insertId
        });
    } catch (error) {
        console.error('Add address error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Update address
exports.updateAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const addressId = req.params.id;
        const { label, fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = req.body;

        // Verify address belongs to user
        const [addresses] = await db.query('SELECT * FROM addresses WHERE id = ? AND user_id = ?', [addressId, userId]);
        if (addresses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        // If this is set as default, unset other defaults
        if (isDefault) {
            await db.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [userId]);
        }

        await db.query(
            `UPDATE addresses SET label = ?, full_name = ?, phone = ?, address_line1 = ?, address_line2 = ?, 
             city = ?, state = ?, pincode = ?, is_default = ? WHERE id = ? AND user_id = ?`,
            [label, fullName, phone, addressLine1, addressLine2 || null, city, state, pincode, isDefault ? 1 : 0, addressId, userId]
        );

        res.json({
            success: true,
            message: 'Address updated successfully'
        });
    } catch (error) {
        console.error('Update address error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Delete address
exports.deleteAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const addressId = req.params.id;

        // Verify address belongs to user
        const [addresses] = await db.query('SELECT * FROM addresses WHERE id = ? AND user_id = ?', [addressId, userId]);
        if (addresses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        await db.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [addressId, userId]);

        res.json({
            success: true,
            message: 'Address deleted successfully'
        });
    } catch (error) {
        console.error('Delete address error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Set default address
exports.setDefaultAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const addressId = req.params.id;

        // Verify address belongs to user
        const [addresses] = await db.query('SELECT * FROM addresses WHERE id = ? AND user_id = ?', [addressId, userId]);
        if (addresses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        // Unset all defaults
        await db.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [userId]);

        // Set this as default
        await db.query('UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?', [addressId, userId]);

        res.json({
            success: true,
            message: 'Default address updated'
        });
    } catch (error) {
        console.error('Set default address error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
