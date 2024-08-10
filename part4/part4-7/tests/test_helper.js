const Blog = require('../models/blog') // Assuming you have a Blog model
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Node.js Best Practices',
    author: 'Rising Ode',
    url: 'https://nodejsbestpractices.com/',
    likes: 5
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'Temporary blog', author: 'Test Author', url: 'https://tempblog.com/', likes: 0 })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}
