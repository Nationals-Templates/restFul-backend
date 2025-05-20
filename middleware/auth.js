// Verify Admin Middleware
exports.verifyAdmin = (req, res, next) => {
    const user = req.user; // From JWT/session
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Admin access required' 
      });
    }
    next(); // Allow access if user is admin
  };

  // middleware/auth.js
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).send('Access denied');
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // ✅ contains id, role, etc.
      next();
    } catch (err) {
      res.status(400).send('Invalid token');
    }
  };
  

 
  
