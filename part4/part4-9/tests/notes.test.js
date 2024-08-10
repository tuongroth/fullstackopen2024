const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Note = require('../models/note')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let token;

beforeEach(async () => {
    await Note.deleteMany({})
    await User.deleteMany({})

    // Create a user and get a token
    const user = new User({ username: 'testuser', passwordHash: 'passwordhash' })
    await user.save()

    const loginResponse = await api
        .post('/api/login')
        .send({ username: 'testuser', password: 'passwordhash' })
    
    token = loginResponse.body.token
})

describe('adding a new note', () => {

    test('succeeds with valid data and token', async () => {
        const newNote = {
            content: 'A new note',
            important: true
        }

        await api
            .post('/api/notes')
            .set('Authorization', `Bearer ${token}`)
            .send(newNote)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const notesAtEnd = await helper.notesInDb()
        expect(notesAtEnd).toHaveLength(1)
        expect(notesAtEnd[0].content).toBe(newNote.content)
    })

    test('fails with status code 401 Unauthorized if token is not provided', async () => {
        const newNote = {
            content: 'A note without token',
            important: true
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(401)

        const notesAtEnd = await helper.notesInDb()
        expect(notesAtEnd).toHaveLength(0)
    })

    // More tests as needed
})

afterAll(() => {
    mongoose.connection.close()
})
