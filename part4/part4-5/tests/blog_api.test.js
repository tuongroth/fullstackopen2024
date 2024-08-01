const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app'); // Adjust the path if needed
const Blog = require('../models/blog'); // Adjust the path if needed
const api = supertest(app);

const initialBlogs = [
  {
    title: 'Test Blog',
    author: 'Tester',
    url: 'http://test.com',
    likes: 0,
  },
  {
    title: 'Second Blog',
    author: 'Tester 2',
    url: 'http://test2.com',
    likes: 2,
  }
];

beforeAll(async () => {
  const uri = "mongodb+srv://fullstack:<password>@cluster0.xgr0xci.mongodb.net/test?retryWrites=true&w=majority";
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

beforeEach(async () => {
  await Blog.deleteMany({});
  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs');
  const blogs = response.body;
  blogs.forEach(blog => {
    expect(blog.id).toBeDefined();
  });
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Another Test Blog',
    author: 'Tester',
    url: 'http://another-test.com',
    likes: 5
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  const titles = response.body.map(r => r.title);

  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(titles).toContain('Another Test Blog');
});

test('default value for likes is 0', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Tester',
    url: 'http://nolikestest.com'
  };

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  expect(response.body.likes).toBe(0);
});

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Tester',
    url: 'http://notitle.com'
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);

  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(initialBlogs.length);
});

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'No URL Blog',
    author: 'Tester'
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);

  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(initialBlogs.length);
});

afterAll(async () => {
  await mongoose.connection.close();
});

