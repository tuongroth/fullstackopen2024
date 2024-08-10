///*Exercise 4.17, 4.18, 4.19, 4.20, 4.21, 4.22: Blog Controller*?//
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

// Exercise 4.17: Include user reference when creating a blog
blogsRouter.post('/', async (request, response) => {
  const user = request.user

  const blog = new Blog({
    ...request.body,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// Exercise 4.17: List all blogs with user information
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// Exercise 4.21: Delete blog only if user is creator
blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'unauthorized' })
  }

  await blog.deleteOne()
  response.status(204).end()
})

module.exports = blogsRouter
