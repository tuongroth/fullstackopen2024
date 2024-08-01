const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app'); // Adjust the path if needed
const Blog = require('../models/blog'); // Adjust the path if needed
const api = supertest(app);

beforeAll(async () => {
  const uri = "mongodb+srv://fullstack:2r6FcH9cLQRdnXHJ@cluster0.xgr0xci.mongodb.net/test?retryWrites=true&w=majority";
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

beforeEach(async () => {
  await Blog.deleteMany({});
  const blog = new Blog({ title: 'Test Blog', author: 'Tester', url: 'http://test.com', likes: 0 });
  await blog.save();
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

afterAll(async () => {
  await mongoose.connection.close();
});
