const jwt = require('jsonwebtoken');

// General middleware to verify any token (can be used for both HR and candidate)
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    // Assuming the token format is "Bearer <token>"
    const tokenPart = token.split(" ")[1];
    if (!tokenPart) {
        return res.status(401).json({ message: 'Malformed token' });
    }

    jwt.verify(tokenPart, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        req.user = decoded; // Attach the decoded token payload to req.user
        next();
    });
};

// Middleware to verify candidate's token
const verifyTokenCandidate = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.user || req.user.role !== 'candidate') {
            return res.status(403).json({ message: 'Access restricted to candidates' });
        }
        next();
    });
};

// Middleware to verify HR's token
const verifyTokenHR = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.user || req.user.role !== 'hr') {
            return res.status(403).json({ message: 'Access restricted to HR' });
        }
        next();
    });
};

module.exports = { verifyToken, verifyTokenHR, verifyTokenCandidate };
