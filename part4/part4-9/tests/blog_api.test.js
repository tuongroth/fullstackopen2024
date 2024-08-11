const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');

const app = require('../app');
const api = supertest(app);

const helper = require('./test_helper');
const User = require('../models/user');
const Blog = require('../models/blog'); // Changed from Note to Blog

// Increase default timeout for long operations like database connections
const TIMEOUT = 10000;

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs); // Changed from initialNotes to initialBlogs
  }, TIMEOUT);

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, helper.initialBlogs.length); // Changed from initialNotes
  });

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');
    const titles = response.body.map(r => r.title); // Assuming 'title' is the field in Blog schema
    assert(titles.includes('Browser can execute only JavaScript')); // Updated content check
  });

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb(); // Changed from notesInDb
      const blogToView = blogsAtStart[0];

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.deepStrictEqual(resultBlog.body, blogToView);
    }, TIMEOUT);

    test('fails with status code 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId();

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404);
    }, TIMEOUT);

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445';

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400);
    }, TIMEOUT);
  });

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'async/await simplifies making async calls', // Updated from content to title
        author: 'John Doe', // Assuming there's an author field
        url: 'http://example.com', // Assuming there's a URL field
        likes: 5 // Assuming there's a likes field
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb(); // Changed from notesInDb
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1); // Changed from initialNotes

      const titles = blogsAtEnd.map(b => b.title); // Changed from content to title
      assert(titles.includes('async/await simplifies making async calls')); // Updated content check
    }, TIMEOUT);

    test('fails with status code 400 if data is invalid', async () => {
      const newBlog = { title: 'Invalid blog' }; // Minimal valid data

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb(); // Changed from notesInDb
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length); // Changed from initialNotes
    }, TIMEOUT);
  });

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb(); // Changed from notesInDb
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb(); // Changed from notesInDb
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1); // Changed from initialNotes

      const titles = blogsAtEnd.map(b => b.title); // Changed from content to title
      assert(!titles.includes(blogToDelete.title)); // Updated content check
    }, TIMEOUT);
  });
});

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });
    await user.save();
  }, TIMEOUT);

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    assert(usernames.includes(newUser.username));
  }, TIMEOUT);

  test('creation fails with proper status code and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes('expected `username` to be unique'));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  }, TIMEOUT);
});

after(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

