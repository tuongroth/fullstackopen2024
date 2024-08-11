const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const express = require('express')
const blogRouter = express.Router()
const User = require('../models/user')

// POST /api/login
blogRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  // Check for missing username or password
  if (!username || !password) {
    return response.status(400).json({
      error: 'Username and password required'
    })
  }

  // Find user by username
  const user = await User.findOne({ username })
  
  // Check if user exists and password is correct
  const passwordCorrect = user ? await bcrypt.compare(password, user.passwordHash) : false

  if (!user || !passwordCorrect) {
    return response.status(401).json({
      error: 'Invalid username or password'
    })
  }

  // Create payload for the token
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // Sign the token
  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' }) // Added expiration for security

  // Send response with token and user details
  response
    .status(200)
    .json({ token, username: user.username, name: user.name }) // Changed `send` to `json` for proper JSON response
})

module.exports = blogRouter
