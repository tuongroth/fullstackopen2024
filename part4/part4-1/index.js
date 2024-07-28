const app = require('./app');
const http = require('http');
const config = require('./utils/config');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const connectToDatabase = async () => {
  try {
    logger.info('Connecting to MongoDB at', config.MONGODB_URI);
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Successfully connected to MongoDB');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the process with failure
  }
};

const startServer = async () => {
  await connectToDatabase();
  const server = http.createServer(app);

  server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
  });
};

startServer();
