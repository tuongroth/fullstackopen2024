const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');

const connectToDatabase = async () => {
  try {
    logger.info('Connecting to MongoDB at', config.MONGODB_URI);
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Successfully connected to MongoDB');

    // Example schema and model
    const blogSchema = new mongoose.Schema({
      title: String,
      author: String,
      url: String,
      likes: Number
    });

    const Blog = mongoose.model('Blog', blogSchema);

    // Example of creating a new blog
    const blog = new Blog({
      title: 'First Blog',
      author: 'Author Name',
      url: 'http://example.com',
      likes: 0
    });

    const savedBlog = await blog.save();
    logger.info('Saved blog:', savedBlog);

    // Example of finding all blogs
    const blogs = await Blog.find({});
    logger.info('All blogs:', blogs);

    mongoose.connection.close();
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error.message);
  }
};

connectToDatabase();
