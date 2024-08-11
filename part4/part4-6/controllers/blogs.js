// controllers/blogsController.js

const Blog = require('../models/blog'); // Adjust the path to the Blog model

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Blog.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(204).end(); // No content
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, likes } = req.body; // Adjusted to include content
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content, likes },
      { new: true, runValidators: true } // Added runValidators for data validation
    );
    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  deleteBlog,
  updateBlog,
};

