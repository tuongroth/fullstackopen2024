const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Provide password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.xgr0xci.mongodb.net/blogApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url)
  .then(() => {
    const blogSchema = new mongoose.Schema({
      title: {
        type: String,
        required: true,
        minlength: 5
      },
      author: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      likes: {
        type: Number,
        default: 0
      }
    });

    const Blog = mongoose.model('Blog', blogSchema);

    // Uncomment to add a new blog
    /*
    const blog = new Blog({
      title: 'New Blog Post',
      author: 'John Doe',
      url: 'http://example.com',
      likes: 10
    });

    blog.save().then(result => {
      console.log('Blog saved!');
      mongoose.connection.close();
    });
    */

    Blog.find({}).then(result => {
      result.forEach(blog => {
        console.log(blog);
      });
      mongoose.connection.close();
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });

