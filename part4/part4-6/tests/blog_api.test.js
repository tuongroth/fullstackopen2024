const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Adjust the path as necessary
const { connectToDatabase, closeDatabaseConnection } = require('./testSetup'); // Ensure this is updated for MongoDB client
const Blog = require('../models/blog'); // Adjust path as necessary
const helper = require('./test_helper'); // Adjust if needed, or create a new helper for blogs

const api = supertest(app);

beforeAll(async () => {
  await connectToDatabase();
  await helper.initializeTestData(); // Ensure this function is defined correctly for blogs
}, 30000);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs); // Ensure `helper.initialBlogs` is correctly defined for blogs
}, 10000);

afterAll(async () => {
  await closeDatabaseConnection();
});

test('deletes a blog post successfully', async () => {
  const blogsAtStart = await api.get('/api/blogs');
  console.log('Blogs at start:', blogsAtStart.body); // Log initial blogs

  const blogToDelete = blogsAtStart.body[0];
  console.log('Blog to delete:', blogToDelete); // Log the blog to be deleted

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await api.get('/api/blogs');
  console.log('Blogs at end:', blogsAtEnd.body); // Log blogs after deletion

  expect(blogsAtEnd.body.length).toBe(blogsAtStart.body.length - 1);

  const titles = blogsAtEnd.body.map(b => b.title);
  console.log('Titles after deletion:', titles); // Log blog titles after deletion

  expect(titles).not.toContain(blogToDelete.title);
}, 10000);

test('updates a blog post successfully', async () => {
  const blogsAtStart = await api.get('/api/blogs');
  console.log('Blogs at start:', blogsAtStart.body); // Log initial blogs

  const blogToUpdate = blogsAtStart.body[0];
  console.log('Blog to update:', blogToUpdate); // Log the blog to be updated

  const updatedData = { ...blogToUpdate, content: 'Updated content' };

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  console.log('Response after update:', response.body); // Log response after update

  expect(response.body.content).toBe(updatedData.content);

  const blogsAtEnd = await api.get('/api/blogs');
  console.log('Blogs at end:', blogsAtEnd.body); // Log blogs after update

  const updatedBlog = blogsAtEnd.body.find(b => b.id === blogToUpdate.id);
  console.log('Updated blog:', updatedBlog); // Log the updated blog

  expect(updatedBlog.content).toBe(updatedData.content);
}, 10000);
