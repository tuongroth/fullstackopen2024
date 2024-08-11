// blogs.test.js

const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Adjust the path to your application entry point
const { connectToDatabase, closeDatabaseConnection } = require('./testSetup');
const Blog = require('../blog'); // Adjust the path to your Blog model
const helper = require('./test_helper'); // A helper file for test data setup

const api = supertest(app);

// Run this before all tests to set up the database
beforeAll(async () => {
  await connectToDatabase();
  await helper.initializeTestData(); // Initialize test data
}, 30000);

// Run this before each test to ensure a clean state
beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs); // Insert initial blog posts
}, 10000);

// Run this after all tests to close the database connection
afterAll(async () => {
  await closeDatabaseConnection();
});

// Test: Deleting a blog post
test('deletes a blog post successfully', async () => {
  const blogsAtStart = await api.get('/api/blogs');
  console.log('Blogs at start:', blogsAtStart.body); // Log initial blogs

  const blogToDelete = blogsAtStart.body[0];
  console.log('Blog to delete:', blogToDelete); // Log the blog to be deleted

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await api.get('/api/blogs');
  console.log('Blogs at end:', blogsAtEnd.body); // Log blogs after deletion

  expect(blogsAtEnd.body.length).toBe(blogsAtStart.body.length - 1);

  const contents = blogsAtEnd.body.map(b => b.title);
  console.log('Titles after deletion:', contents); // Log blog titles after deletion

  expect(contents).not.toContain(blogToDelete.title);
}, 10000);

// Test: Updating a blog post
test('updates a blog post successfully', async () => {
  const blogsAtStart = await api.get('/api/blogs');
  console.log('Blogs at start:', blogsAtStart.body); // Log initial blogs

  const blogToUpdate = blogsAtStart.body[0];
  console.log('Blog to update:', blogToUpdate); // Log the blog to be updated

  const updatedData = { ...blogToUpdate, title: 'Updated title', content: 'Updated content' };

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  console.log('Response after update:', response.body); // Log response after update

  expect(response.body.title).toBe(updatedData.title);
  expect(response.body.content).toBe(updatedData.content);

  const blogsAtEnd = await api.get('/api/blogs');
  console.log('Blogs at end:', blogsAtEnd.body); // Log blogs after update

  const updatedBlog = blogsAtEnd.body.find(b => b.id === blogToUpdate.id);
  console.log('Updated blog:', updatedBlog); // Log the updated blog

  expect(updatedBlog.title).toBe(updatedData.title);
  expect(updatedBlog.content).toBe(updatedData.content);
}, 10000);
