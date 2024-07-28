const app = require('./app');
const http = require('http');
const config = require('./utils/config');
const logger = require('./utils/logger');
const connectToDatabase = require('./utils/database');

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectToDatabase();
    server.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error.message);
  }
};

startServer();
