const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Create a new blog
router.post('/', async (req, res) => {
  const { title, author, url, likes = 0, user } = req.body;

  const newBlog = new Blog({
    title,
    author,
    url,
    likes,
    user,
  });

  try {
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create blog' });
  }
});

// Update a blog (like)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, { likes }, { new: true });
    res.json(updatedBlog);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update blog' });
  }
});

// Delete a blog
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Blog.findByIdAndRemove(id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete blog' });
  }
});

module.exports = router;
