import React, { useState } from 'react';

const Blog = ({ blog, onLike }) => {
  const [visible, setVisible] = useState(false);

  const toggleDetails = () => {
    setVisible(!visible);
  };

  return (
    <div className="blog">
      <h2 className="blog-title">{blog.title}</h2>
      <p className="blog-author">{blog.author}</p>
      <button onClick={toggleDetails}>
        {visible ? 'Hide details' : 'Show details'}
      </button>
      {visible && (
        <>
          <p className="blog-url">{blog.url}</p>
          <p className="blog-likes">{blog.likes} likes</p>
          <button onClick={onLike}>Like</button>
        </>
      )}
    </div>
  );
};

export default Blog;
