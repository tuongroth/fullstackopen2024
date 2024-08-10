const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/blogApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url).then(() => {
  const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
  });

  const Blog = mongoose.model('Blog', blogSchema);

  // Uncomment to add a new blog
  /*
  const blog = new Blog({
    title: 'Example Blog Title',
    author: 'Author Name',
    url: 'http://example.com',
    likes: 10,
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
});