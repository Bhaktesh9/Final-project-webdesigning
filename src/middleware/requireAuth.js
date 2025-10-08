// Authentication middleware using JWT
const jwt = require('jsonwebtoken');
const User = require('../utils/db').User;

module.exports = function requireAuth(roles = []) {
  return async function (req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      // Check user role
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient role' });
      }
      // Optionally check user status
      const user = await User.findById(decoded.id);
      if (!user || user.status !== 'active') {
        return res.status(401).json({ message: 'User not active' });
      }
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};
