const express = require('express');
const app = express();
const notesRouter = require('./controllers/notes'); // Assuming your notes routes are in `controllers/notes.js`
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');

// Use the middleware only in /api/notes routes
app.use('/api/notes', middleware.userExtractor, notesRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

module.exports = app;
