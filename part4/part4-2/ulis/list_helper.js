// utils/list_helper.js
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  return blogs.reduce((favorite, blog) => {
    return blog.likes > (favorite.likes || 0) ? blog : favorite;
  }, {});
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;
  const authors = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1;
    return acc;
  }, {});
  const authorWithMostBlogs = Object.keys(authors).reduce((a, b) => authors[a] > authors[b] ? a : b);
  return {
    author: authorWithMostBlogs,
    blogs: authors[authorWithMostBlogs]
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;
  const authors = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc;
  }, {});
  const authorWithMostLikes = Object.keys(authors).reduce((a, b) => authors[a] > authors[b] ? a : b);
  return {
    author: authorWithMostLikes,
    likes: authors[authorWithMostLikes]
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
