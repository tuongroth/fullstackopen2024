const express = require('express');
const morgan = require('morgan');
const portfinder = require('portfinder');
const path = require('path');
const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('dist'));  // Serve Vite build

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(person => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.get('/info', (req, res) => {
  const entriesCount = persons.length;
  const requestTime = new Date();
  res.send(`
    <p>Phonebook has info for ${entriesCount} people</p>
    <p>${requestTime}</p>
  `);
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({ error: 'name or number is missing' });
  }
  if (persons.find(person => person.name === name)) {
    return res.status(400).json({ error: 'name must be unique' });
  }
  const newPerson = { id: (Math.random() * 1000000).toString(), name, number };
  persons.push(newPerson);
  res.status(201).json(newPerson);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

// Port configuration
portfinder.basePort = 3001;
portfinder.getPortPromise().then(PORT => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error(err);
});
