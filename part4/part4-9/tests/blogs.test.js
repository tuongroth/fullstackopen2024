const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Blog = require('../models/blog'); // Changed from Note to Blog
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

let token;

beforeEach(async () => {
    await Blog.deleteMany({}); // Changed from Note to Blog
    await User.deleteMany({});

    // Create a user and get a token
    const user = new User({ username: 'testuser', passwordHash: 'passwordhash' });
    await user.save();

    const loginResponse = await api
        .post('/api/login')
        .send({ username: 'testuser', password: 'passwordhash' });
    
    token = loginResponse.body.token;
});

describe('adding a new blog', () => {

    test('succeeds with valid data and token', async () => {
        const newBlog = {
            title: 'A new blog', // Updated from content to title
            author: 'Author Name', // Added author field
            url: 'http://example.com', // Added url field
            likes: 10 // Added likes field
        };

        await api
            .post('/api/blogs') // Changed endpoint from /api/notes to /api/blogs
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const blogsAtEnd = await helper.blogsInDb(); // Changed from notesInDb to blogsInDb
        expect(blogsAtEnd).toHaveLength(1);
        expect(blogsAtEnd[0].title).toBe(newBlog.title); // Updated from content to title
    });

    test('fails with status code 401 Unauthorized if token is not provided', async () => {
        const newBlog = {
            title: 'A blog without token', // Updated from content to title
            author: 'Author Name',
            url: 'http://example.com',
            likes: 10
        };

        await api
            .post('/api/blogs') // Changed endpoint from /api/notes to /api/blogs
            .send(newBlog)
            .expect(401);

        const blogsAtEnd = await helper.blogsInDb(); // Changed from notesInDb to blogsInDb
        expect(blogsAtEnd).toHaveLength(0);
    });

    // More tests as needed
});

afterAll(() => {
    mongoose.connection.close();
});
