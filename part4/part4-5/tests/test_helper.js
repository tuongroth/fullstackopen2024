const Blog = require('../models/blog'); // Update to import Blog model

const initialBlogs = [
  {
    title: 'HTML is easy',
    content: 'HTML is straightforward to learn and use for structuring web pages.',
    author: 'John Doe',
    likes: 5
  },
  {
    title: 'Browser can execute only JavaScript',
    content: 'Modern web browsers can only execute JavaScript code directly, not HTML or CSS.',
    author: 'Jane Smith',
    likes: 10
  }
];

const nonExistingId = async () => {
  const blog = new Blog({ 
    title: 'Temporary Blog',
    content: 'This blog will be removed soon.',
    author: 'Temp Author',
    likes: 0 
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

module.exports = {
  initialBlogs, 
  nonExistingId, 
  blogsInDb
};
