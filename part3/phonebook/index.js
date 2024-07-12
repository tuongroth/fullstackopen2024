const express = require('express');
const app = express();

app.use(express.json());

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

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(person => person.id === id);
  
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.get('/info', (request, response) => {
  const entriesCount = persons.length;
  const requestTime = new Date();
  
  response.send(`
    <p>Phonebook has info for ${entriesCount} people</p>
    <p>${requestTime}</p>
  `);
});

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;
  
  if (!name || !number) {
    return response.status(400).json({
      error: 'name or number is missing'
    });
  }
  
  if (persons.find(person => person.name === name)) {
    return response.status(400).json({
      error: 'name must be unique'
    });
  }
  
  const newPerson = {
    id: (Math.random() * 1000000).toString(),
    name,
    number
  };
  
  persons.push(newPerson);
  response.status(201).json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
