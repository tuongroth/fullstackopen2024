const mongoose = require('mongoose');

// Define the schema for a blog post
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5
  },
  content: {
    type: String,
    required: true,
    minlength: 10
  },
  published: {
    type: Boolean,
    default: false
  }
}).set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// Create the Blog model, or use the existing one if it exists
const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

// Initial data for testing
const initialBlogs = [
  { title: 'Introduction to JavaScript', content: 'JavaScript is a versatile programming language.', published: true },
  { title: 'Understanding HTTP', content: 'HTTP is the foundation of data communication on the web.', published: false },
];

// Function to get all blogs from the database
const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

// Function to get a non-existing ID
const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Temporary Blog Post',
    content: 'This blog post will be removed soon.',
    published: false,
  });
  await blog.save();
  await blog.remove();
  return blog._id.toString();
};

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId
};
