const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    console.log('Auth Header:', authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: 'No Authorization header found' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token:', token);
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    console.log('JWT Secret:', process.env.JWT_SECRET ? 'Present' : 'Missing');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Find user
    const user = await User.findById(decoded.id).select('-password');
    console.log('Found user:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    res.status(401).json({ message: 'Token is not valid', error: error.message });
  }
};

module.exports = auth; 