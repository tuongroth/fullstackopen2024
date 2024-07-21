const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const app = express();


const Person = require('./models/person');

app.use(express.json()); 
app.use(express.static('dist')); 

const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', async (req, res) => {
  const persons = await Person.find({});
  res.json(persons);
});

app.post('/api/persons', async (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Name or number missing' });
  }

  const existingPerson = await Person.findOne({ name: body.name });

  if (existingPerson) {
    existingPerson.number = body.number;
    const updatedPerson = await existingPerson.save();
    res.json(updatedPerson);
  } else {
    const person = new Person({
      name: body.name,
      number: body.number,
    });

    const savedPerson = await person.save();
    res.json(savedPerson);
  }
});

app.get('/api/persons/:id', async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    res.status(400).send({ error: 'Malformatted ID' });
  }
});

app.delete('/api/persons/:id', async (req, res) => {
  try {
    await Person.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(400).send({ error: 'Malformatted ID' });
  }
});

app.use((req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' });
});


app.use((error, req, res, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    res.status(400).send({ error: 'Malformatted ID' });
  } else {
    res.status(500).end(); 
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
