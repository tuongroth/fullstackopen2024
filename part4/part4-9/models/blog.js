const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5 // Adjust the minlength or other validation rules as needed
  },
  important: Boolean, // You may want to adjust this field or add more fields specific to blogs
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Ensure this refers to the User model
  }
})

// Define how the schema should be converted to JSON
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)

