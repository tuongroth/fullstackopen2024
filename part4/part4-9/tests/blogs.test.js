const { test, describe, beforeEach, afterAll } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app') // Adjust the path to your Express app
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, nonExistingId, blogsInDb, usersInDb } = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const user = new User({ username: 'testuser', passwordHash: 'hashedpassword' })
  await user.save()

  const blogObjects = initialBlogs.map(blog => new Blog({ ...blog, user: user._id }))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

afterAll(() => {
  mongoose.connection.close()
})

describe('Blog API', () => {
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are the correct number of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.content)
    assert.ok(contents.includes('React patterns'))
  })

  test('a valid blog can be added', async () => {
    const user = await User.findOne({})
    const newBlog = {
      title: 'New Blog',
      author: 'Author Name',
      url: 'https://newblog.com/',
      likes: 10,
      user: user._id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

    const titles = blogsAtEnd.map(r => r.title)
    assert.ok(titles.includes('New Blog'))
  })

  test('a blog without a title is not added', async () => {
    const user = await User.findOne({})
    const newBlog = {
      author: 'Author Name',
      url: 'https://newblog.com/',
      likes: 10,
      user: user._id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
  })

  test('a blog can be deleted', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1)

    const titles = blogsAtEnd.map(r => r.title)
    assert.ok(!titles.includes(blogToDelete.title))
  })

  test('a blog can be updated', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    const updatedBlogFromDb = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
    assert.strictEqual(updatedBlogFromDb.likes, blogToUpdate.likes + 1)
  })
})


afterAll(() => {
    mongoose.connection.close()
})
