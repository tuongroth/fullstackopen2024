const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  // Seed your test database with users
})

// Exercise 4.16: Test for invalid user creation
test('user creation fails with proper statuscode and message if username or password are invalid', async () => {
  const invalidUser = {
    username: 'ro',
    password: 'pw',
  }

  const result = await api
    .post('/api/users')
    .send(invalidUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('password must be at least 3 characters long')
})

// Exercise 4.23: Test for unauthorized blog creation
test('adding a blog fails with status code 401 Unauthorized if no token is provided', async () => {
  const newBlog = {
    title: 'Unauthorized Blog',
    author: 'Anonymous',
    url: 'http://example.com',
    likes: 10
  }

  await api
   
