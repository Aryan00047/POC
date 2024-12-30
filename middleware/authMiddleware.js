const jwt = require('jsonwebtoken');

// Middleware to protect routes based on roles and user ownership
const protectRoute = (roles) => {
    return (req, res, next) => {
      const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Bearer
      
      console.log('Token:', token);  // Debugging line to log token
  
      if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
      }
  
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded token payload to request object
  
        console.log('Authenticated user:', req.user);  // Debugging line to log req.user
  
        // Check if the user's role matches allowed roles
        if (!roles.includes(decoded.role)) {
          return res.status(403).json({ message: 'Access denied. You do not have permission for this role.' });
        }
  
        // Ensure user can only access their own profile (check userId)
        if (req.params.userId && req.params.userId !== decoded.userId.toString()) {
          return res.status(403).json({ message: 'Access denied. You cannot access another user\'s profile.' });
        }
  
        next();
      } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
      }
    };
  };
  

module.exports = { protectRoute };
