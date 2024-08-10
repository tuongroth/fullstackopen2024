const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Ensure you have the correct path to your User model
const logger = require('./logger'); // Assuming you have a logger utility

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization');
  let token = null;
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7);
  }

  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' });
      }

      const user = await User.findById(decodedToken.id);
      if (!user) {
        return response.status(401).json({ error: 'user not found' });
      }

      request.user = user;
    } catch (error) {
      logger.error(error);
      return response.status(401).json({ error: 'token invalid' });
    }
  } else {
    return response.status(401).json({ error: 'token missing' });
  }

  next();
};

module.exports = {
  // other middleware
  userExtractor,
};
