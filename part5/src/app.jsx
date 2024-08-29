import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Notification Component
const Notification = ({ message, type }) => {
  if (message === null) return null;

  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  );
};

// Blog Component
const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes}{' '}
            <button onClick={() => handleLike(blog)}>like</button>
          </p>
          <p>{blog.user?.name}</p>
          {user.username === blog.user?.username && (
            <button onClick={() => handleDelete(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

// BlogForm Component
const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [visible, setVisible] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    createBlog({ title, author, url });
    setTitle('');
    setAuthor('');
    setUrl('');
    setVisible(false);
  };

  return (
    <div>
      {!visible ? (
        <button onClick={() => setVisible(true)}>create new blog</button>
      ) : (
        <div>
          <h2>Create New</h2>
          <form onSubmit={handleSubmit}>
            <div>
              title:
              <input
                type="text"
                value={title}
                onChange={({ target }) => setTitle(target.value)}
              />
            </div>
            <div>
              author:
              <input
                type="text"
                value={author}
                onChange={({ target }) => setAuthor(target.value)}
              />
            </div>
            <div>
              url:
              <input
                type="text"
                value={url}
                onChange={({ target }) => setUrl(target.value)}
              />
            </div>
            <button type="submit">create</button>
          </form>
          <button onClick={() => setVisible(false)}>cancel</button>
        </div>
      )}
    </div>
  );
};

// App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState({ message: null, type: '' });

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      fetchBlogs();
    }
  }, []);

  const fetchBlogs = async () => {
    const response = await axios.get('/api/blogs'); // Replace with your API endpoint
    setBlogs(response.data.sort((a, b) => b.likes - a.likes));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        'https://eu-west-2.aws.services.cloud.mongodb.com/api/client/v2.0/app/data-zbmnuij/auth/providers/local-userpass/login',
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('loggedBlogAppUser', JSON.stringify(userData));
      setNotification({ message: 'Login successful', type: 'success' });
      setTimeout(() => setNotification({ message: null, type: '' }), 5000);
      fetchBlogs();
    } catch (error) {
      console.error('Login failed:', error);
      setNotification({ message: 'Login failed', type: 'error' });
      setTimeout(() => setNotification({ message: null, type: '' }), 5000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
    setBlogs([]);
  };

  const createBlog = async (newBlog) => {
    try {
      const response = await axios.post('/api/blogs', newBlog, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBlogs(blogs.concat(response.data));
      setNotification({ message: `A new blog "${newBlog.title}" added`, type: 'success' });
      setTimeout(() => setNotification({ message: null, type: '' }), 5000);
    } catch (error) {
      console.error('Failed to create blog:', error);
      setNotification({ message: 'Failed to create blog', type: 'error' });
      setTimeout(() => setNotification({ message: null, type: '' }), 5000);
    }
  };

  const handleLike = async (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };

    try {
      await axios.put(`/api/blogs/${blog.id}`, updatedBlog, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBlogs(blogs.map(b => (b.id === blog.id ? updatedBlog : b)));
    } catch (error) {
      console.error('Failed to like blog:', error);
      setNotification({ message: 'Failed to like blog', type: 'error' });
      setTimeout(() => setNotification({ message: null, type: '' }), 5000);
    }
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      try {
        await axios.delete(`/api/blogs/${blog.id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBlogs(blogs.filter(b => b.id !== blog.id));
        setNotification({ message: `Blog "${blog.title}" removed`, type: 'success' });
        setTimeout(() => setNotification({ message: null, type: '' }), 5000);
      } catch (error) {
        console.error('Failed to delete blog:', error);
        setNotification({ message: 'Failed to delete blog', type: 'error' });
        setTimeout(() => setNotification({ message: null, type: '' }), 5000);
      }
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <form onSubmit={handleLogin}>
          <div>
            Username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            Password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      <h2>blogs</h2>
      <p>{user.username} logged in</p>
      <button onClick={handleLogout}>Logout</button>
      <BlogForm createBlog={createBlog} />
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete} user={user} />
      ))}
    </div>
  );
};

export default App;
