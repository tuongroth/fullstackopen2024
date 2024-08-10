const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('when the blog database is populated', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const user = new User({
      username: 'root',
      passwordHash: await bcrypt.hash('sekret', 10)
    })
    await user.save()

    const userFromDb = await User.findOne({})

    const initialBlogs = [
      {
        title: 'Initial Blog One',
        author: 'Author A',
        url: 'http://initialone.com',
        likes: 7,
        user: userFromDb._id
      },
      {
        title: 'Initial Blog Two',
        author: 'Author B',
        url: 'http://initialtwo.com',
        likes: 12,
        user: userFromDb._id
      }
    ]

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('returns blogs in JSON format', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('verifies the number of blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('checks for a specific blog in the response', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(blog => blog.title)
    expect(titles).toContain('Initial Blog One')
  })

  test('allows adding a new valid blog', async () => {
    const user = await User.findOne({})
    const newBlog = {
      title: 'Added Blog',
      author: 'New Author',
      url: 'https://addedblog.com/',
      likes: 20,
      user: user._id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain('Added Blog')
  })

  test('fails to add a blog without a title', async () => {
    const user = await User.findOne({})
    const newBlog = {
      author: 'Author Name',
      url: 'https://invalidblog.com/',
      likes: 10,
      user: user._id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('allows deleting a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test('allows updating a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 2
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updated
afterAll(async () => {
  await mongoose.connection.close()
})
