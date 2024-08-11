const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/blogApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');

    const blogSchema = new mongoose.Schema({
      title: {
        type: String,
        required: true,
        minlength: 1
      },
      author: String,
      url: String,
      likes: {
        type: Number,
        default: 0
      }
    });

    const Blog = mongoose.model('Blog', blogSchema);

    // Uncomment this block to create a new blog post
    /*
    const blog = new Blog({
      title: 'Example Blog Post',
      author: 'John Doe',
      url: 'http://example.com',
      likes: 5
    });

    blog.save().then(result => {
      console.log('Blog saved!');
      mongoose.connection.close();
    });
    */

    // List all blog posts
    Blog.find({}).then(result => {
      result.forEach(blog => {
        console.log(blog);
      });
      mongoose.connection.close();
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
  });
