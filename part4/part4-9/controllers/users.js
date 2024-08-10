*Exercise 4.15, 4.16, 4.17: User Controller to handle user creation and listing
const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

// Exercise 4.15: Create new user
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // Exercise 4.16: Validate username and password
  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'password must be at least 3 characters long'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

// Exercise 4.15: Get all users
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users)
})

module.exports = usersRouter
