// notes.test.js
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Correct path to your app
const { connectToDatabase, closeDatabaseConnection } = require('./testSetup');
const Note = require('../note'); // Adjust path as necessary
const helper = require('./test_helper'); // Assuming you have a file for test data setup

const api = supertest(app);

beforeAll(async () => {
  await connectToDatabase();
  await helper.initializeTestData(); // Ensure this function is defined correctly
}, 30000);

beforeEach(async () => {
  await Note.deleteMany({});
  await Note.insertMany(helper.initialNotes); // Ensure `helper.initialNotes` is correctly defined
}, 10000);

afterAll(async () => {
  await closeDatabaseConnection();
});

test('deletes a note successfully', async () => {
  const notesAtStart = await api.get('/api/notes');
  console.log('Notes at start:', notesAtStart.body); // Log initial notes

  const noteToDelete = notesAtStart.body[0];
  console.log('Note to delete:', noteToDelete); // Log the note to be deleted

  await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

  const notesAtEnd = await api.get('/api/notes');
  console.log('Notes at end:', notesAtEnd.body); // Log notes after deletion

  expect(notesAtEnd.body.length).toBe(notesAtStart.body.length - 1);

  const contents = notesAtEnd.body.map(n => n.content);
  console.log('Contents after deletion:', contents); // Log note contents after deletion

  expect(contents).not.toContain(noteToDelete.content);
}, 10000);

test('updates a note successfully', async () => {
  const notesAtStart = await api.get('/api/notes');
  console.log('Notes at start:', notesAtStart.body); // Log initial notes

  const noteToUpdate = notesAtStart.body[0];
  console.log('Note to update:', noteToUpdate); // Log the note to be updated

  const updatedData = { ...noteToUpdate, content: 'Updated content' };

  const response = await api
    .put(`/api/notes/${noteToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  console.log('Response after update:', response.body); // Log response after update

  expect(response.body.content).toBe(updatedData.content);

  const notesAtEnd = await api.get('/api/notes');
  console.log('Notes at end:', notesAtEnd.body); // Log notes after update

  const updatedNote = notesAtEnd.body.find(n => n.id === noteToUpdate.id);
  console.log('Updated note:', updatedNote); // Log the updated note

  expect(updatedNote.content).toBe(updatedData.content);
}, 10000);
