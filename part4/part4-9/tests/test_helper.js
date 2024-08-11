const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'John Doe',
    url: 'http://example.com/html',
    likes: 10
  },
  {
    title: 'JavaScript is awesome',
    author: 'Jane Doe',
    url: 'http://example.com/js',
    likes: 20
  }
];

const nonExistingId = async () => {
  const blog = new Blog({ title: 'Temporary blog', author: 'Temp Author', url: 'http://example.com/temp', likes: 1 });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
};

