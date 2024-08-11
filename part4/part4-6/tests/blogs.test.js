const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const { connectToDatabase, closeDatabaseConnection } = require('./setup');
const api = supertest(app);

const initialBlogs = [
  { title: 'First blog', author: 'Author One', url: 'http://example.com/1', likes: 5 },
  { title: 'Second blog', author: 'Author Two', url: 'http://example.com/2', likes: 10 },
];

beforeAll(async () => {
  await connectToDatabase();
}, 30000);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
}, 10000);

afterAll(async () => {
  await closeDatabaseConnection();
});

describe('when there are initially some blogs saved', () => {

  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body.length).toBe(initialBlogs.length);
  });

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');
    const titles = response.body.map(r => r.title);
    expect(titles).toContain('First blog');
  });

  describe('viewing a specific blog', () => {

    test('succeeds with a valid id', async () => {
      const blogsAtStart = await api.get('/api/blogs');
      const blogToView = blogsAtStart.body[0];
      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      expect(resultBlog.body).toEqual(blogToView);
    });

    test('fails with status code 404 if blog does not exist', async () => {
      const validNonexistingId = '604c4e9d6b7e3d3f7e0c8f6a'; // Replace with a valid non-existing ID
      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404);
    });

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = 'invalid-id';
      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400);
    });
  });

  describe('addition of a new blog', () => {

    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'New Blog',
        author: 'Author Three',
        url: 'http://example.com/3',
        likes: 3,
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await api.get('/api/blogs');
      expect(blogsAtEnd.body.length).toBe(initialBlogs.length + 1);

      const titles = blogsAtEnd.body.map(b => b.title);
      expect(titles).toContain('New Blog');
    });

    test('fails with status code 400 if title is missing', async () => {
      const newBlog = {
        author: 'Author Four',
        url: 'http://example.com/4',
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400);
    });

    test('fails with status code 400 if url is missing', async () => {
      const newBlog = {
        title: 'Missing URL Blog',
        author: 'Author Five',
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400);
    });

    test('likes defaults to 0 if missing', async () => {
      const newBlog = {
        title: 'Default Likes Blog',
        author: 'Author Six',
        url: 'http://example.com/6',
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await api.get('/api/blogs');
      const createdBlog = blogsAtEnd.body.find(b => b.title === 'Default Likes Blog');
      expect(createdBlog.likes).toBe(0);
    });
  });

  describe('deletion of a blog', () => {

    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await api.get('/api/blogs');
      const blogToDelete = blogsAtStart.body[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204);

      const blogsAtEnd = await api.get('/api/blogs');
      expect(blogsAtEnd.body.length).toBe(initialBlogs.length - 1);

      const titles = blogsAtEnd.body.map(r => r.title);
      expect(titles).not.toContain(blogToDelete.title);
    });
  });

  describe('updating a blog', () => {

    test('succeeds with valid data', async () => {
      const blogsAtStart = await api.get('/api/blogs');
      const blogToUpdate = blogsAtStart.body[0];
      const updatedData = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body.likes).toBe(updatedData.likes);

      const blogsAtEnd = await api.get('/api/blogs');
      const updatedBlog = blogsAtEnd.body.find(b => b.id === blogToUpdate.id);
      expect(updatedBlog.likes).toBe(updatedData.likes);
    });
  });
});
