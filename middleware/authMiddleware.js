const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    try {
        // Decoding the token and attaching the HR data to req.hr
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.hr = decoded;  // Attach HR details to req.hr
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
    }
};

module.exports = authMiddleware;
