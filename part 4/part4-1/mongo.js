const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');

const connectToDatabase = async () => {
  try {
    logger.info('Connecting to MongoDB at', config.MONGODB_URI);
    await mongoose.connect(config.MONGODB_URI);
    logger.info('Successfully connected to MongoDB');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the process with failure
  }
};

connectToDatabase();
