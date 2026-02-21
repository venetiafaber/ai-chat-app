import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if(req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    //console.log(`token:${token}`);

    if(!token) {
      const error = new Error('Not authorized, no token provided');
      error.statusCode = 401;
      throw error;
    }

    // verifies token, jwt.verify returns payload (contains userId) if valid
    // eg: decoded = {id: "123..", iat: , exp:}
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // finds user by id from token
    // and attaches user to the request object
    // now any route after this middleware can access req.user
    req.user = await User.findById(decoded.id).select('-password');

    if(!req.user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      throw error;
    }

    // user is authenticates, continue to route handler
    next();

  } catch (error) {
    if(error.name === 'JsonWebTokenError') {
      error.message = 'Invalid token';
      error.statusCode = 401;
    }

    if(error.name === 'TokenExpiredError') {
      error.message = 'Token expired';
      error.statusCode = 401;
    }

    next(error);

  }
};