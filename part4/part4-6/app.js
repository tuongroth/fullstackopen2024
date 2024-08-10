// app.js

const express = require('express');
const app = express();
const notesController = require('./controllers/notes.js'); // Adjust the path as necessary

app.use(express.json()); // For parsing application/json

// Define routes
app.delete('/api/notes/:id', notesController.deleteNote);
app.patch('/api/notes/:id', notesController.updateNote);

module.exports = app;
