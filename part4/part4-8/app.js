const express = require('express');
const app = express();
const blogsRouter = require('./controllers/blogs'); // Updated path
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');

// Use the middleware only in /api/blogs routes
app.use('/api/blogs', middleware.userExtractor, blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

module.exports = app;
