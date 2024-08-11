const mongoose = require('mongoose');

// Define the schema for a blog
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create the model from the schema
const Blog = mongoose.model('Blog', blogSchema);

// Export the model and any custom methods
module.exports = Blog;

// Example of custom static method
// You can add custom static methods to your schema if needed
blogSchema.statics.findByTitle = async function(title) {
  return this.find({ title: new RegExp(title, 'i') }); // Case-insensitive search
};

// Example of custom instance method
// You can add custom instance methods to your schema if needed
blogSchema.methods.incrementLikes = async function() {
  this.likes += 1;
  return this.save();
};
