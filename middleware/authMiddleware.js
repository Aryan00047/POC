const jwt = require('jsonwebtoken');

console.log("auth middleware called")
// Middleware to verify token for admin, candidates and HR
const verifyToken = (role) => (req, res, next) => {
//role is a parameter for hr or candidate or admin

    console.log("Middleware: Verifying token"); 

    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    // Extract the token part from the "Bearer token" format
    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') { // Bearer {token} it is splitting the tokenpart 
        return res.status(401).json({ message: 'Invalid token format' });
    }

    jwt.verify(tokenParts[1], process.env.JWT_SECRET, (err, decoded) => {//after verifying details are decoded
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        // specific role details are attatched
        req[role] = decoded;
        console.log("Role is", req[role])
        next();
    });
};

// Exporting admin, candidate and HR token verification middleware
module.exports = {
    verifyTokenCandidate: verifyToken('candidate'),
    verifyTokenHR: verifyToken('hr'),
    verifyTokenAdmin: verifyToken('admin')
};
