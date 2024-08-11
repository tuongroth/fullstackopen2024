const blogsRouter = require('express').Router();
const Blog = require('../models/blog'); // Assuming you have a Blog model
const User = require('../models/user');

// Create a new blog
blogsRouter.post('/', async (request, response) => {
  const user = request.user; // Extracted by the middleware

  const blog = new Blog({
    content: request.body.content,
    important: request.body.important || false,
    user: user._id, // Associate the blog with the user
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

// Delete a blog
blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user; // Extracted by the middleware
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' });
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'unauthorized' });
  }

  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

module.exports = blogsRouter;
