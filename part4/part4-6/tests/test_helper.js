const mongoose = require('mongoose');
const Note = mongoose.models.Note || mongoose.model('Note', new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
}).set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
}));

// Export helper functions or other utilities
const initialNotes = [
  { content: 'Browser can execute only JavaScript', important: true },
  { content: 'HTTP is an application protocol', important: false },
];

const notesInDb = async () => {
  const notes = await Note.find({});
  return notes.map(note => note.toJSON());
};

const nonExistingId = async () => {
  const note = new Note({
    content: 'willremovethissoon',
    important: true,
  });
  await note.save();
  await note.remove();
  return note._id.toString();
};

module.exports = {
  initialNotes,
  notesInDb,
  nonExistingId
};
