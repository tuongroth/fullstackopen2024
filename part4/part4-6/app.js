const express = require('express');
const app = express();
const blogsController = require('./controllers/blogs'); // Adjust the path if necessary

app.use(express.json()); // For parsing application/json

// Define routes for blog posts
app.delete('/api/blogs/:id', blogsController.deleteBlog);
app.patch('/api/blogs/:id', blogsController.updateBlog);

module.exports = app;
