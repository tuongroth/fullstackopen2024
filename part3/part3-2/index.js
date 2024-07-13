const express = require('express');
const morgan = require('morgan');
const portfinder = require('portfinder');
const app = express();

app.use(express.json());

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

app.use(requestLogger);

// Define custom tokens
morgan.token('body', (req) => {
  // Avoid logging sensitive data by filtering the keys
  const { password, ...filteredBody } = req.body;
  return JSON.stringify(filteredBody);
});

// Use custom tokens in Morgan's format
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

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

portfinder.basePort = 3001; 
portfinder.getPortPromise().then((PORT) => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error(err);
});
