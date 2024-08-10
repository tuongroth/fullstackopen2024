const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

// Create a new blog post
blogsRouter.post('/', async (request, response) => {
  const user = request.user; // Extracted by the middleware

  const blog = new Blog({
    title: request.body.title,
    content: request.body.content,
    tags: request.body.tags || [],
    important: request.body.important || false,
    author: user._id, // Associate the blog post with the user
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

// Delete a blog post
blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user; // Extracted by the middleware
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' });
  }

  if (blog.author.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'unauthorized' });
  }

  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

module.exports = blogsRouter;
