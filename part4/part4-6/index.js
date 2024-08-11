const express = require('express');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const config = require('./utils/config'); // Make sure to define your configuration file

// Import routes
const blogsRouter = require('./controllers/blogs'); // Update path to the blogs controller

const app = express();

// Middleware
app.use(express.json()); // For parsing JSON bodies

// Logging middleware
app.use(logger.requestLogger); // Ensure logger.requestLogger is correctly defined

// Routes
app.use('/api/blogs', blogsRouter); // Update path to the blogs routes

// Health check route
app.get('/health', (req, res) => {
  res.send('OK');
});

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).send({ error: 'Unknown endpoint' });
});

app.use((error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'Malformed ID' });
  }

  next(error);
});

app.use((error, req, res, next) => {
  res.status(500).send({ error: 'Internal server error' });
});

// Connect to MongoDB and start the server
const PORT = config.PORT || 3001;

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

module.exports = app;

