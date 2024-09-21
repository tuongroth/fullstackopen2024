import React, { useState } from 'react';

const BlogForm = ({ handleCreateBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogAuthor, setNewBlogAuthor] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    handleCreateBlog(newBlogTitle, newBlogAuthor);
    setNewBlogTitle('');
    setNewBlogAuthor('');
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        Title
        <input
          type="text"
          value={newBlogTitle}
          onChange={({ target }) => setNewBlogTitle(target.value)}
          id="blog-title"
        />
      </div>
      <div>
        Author
        <input
          type="text"
          value={newBlogAuthor}
          onChange={({ target }) => setNewBlogAuthor(target.value)}
          id="blog-author"
        />
      </div>
      <button type="submit" id="create-blog-button">Create</button>
    </form>
  );
};

export default BlogForm;
