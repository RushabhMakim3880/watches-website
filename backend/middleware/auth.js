const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    // Get token from header
    const token = req.headers['authorization']?.split(' ')[1] || req.headers['x-access-token'];

    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'No token provided. Please login first.'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token. Please login again.'
        });
    }
};

// Optional auth - doesn't fail if no token
const optionalAuth = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req.headers['x-access-token'];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.id;
            req.userEmail = decoded.email;
        } catch (error) {
            // Token invalid but continue anyway
        }
    }
    next();
};

module.exports = { verifyToken, optionalAuth };
