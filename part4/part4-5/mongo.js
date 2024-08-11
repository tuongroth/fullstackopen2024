const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/blogApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url).then(() => {
  const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    likes: Number,
  });

  const Blog = mongoose.model('Blog', blogSchema);

  /*
  const blog = new Blog({
    title: 'Sample Blog Title',
    content: 'This is the content of the sample blog.',
    author: 'Author Name',
    likes: 0,
  });

  blog.save().then(result => {
    console.log('blog saved!');
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
