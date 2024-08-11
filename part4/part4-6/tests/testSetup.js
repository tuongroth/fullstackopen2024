const Note = require('../note'); // Ensure this path is correct

const initialNotes = [
  { content: 'First note', important: true },
  { content: 'Second note', important: false },
];

const initializeTestData = async () => {
  await Note.deleteMany({});
  await Note.insertMany(initialNotes);
};

module.exports = {
  initializeTestData
};
