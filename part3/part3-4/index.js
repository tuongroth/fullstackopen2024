const express = require('express');
const morgan = require('morgan');
const portfinder = require('portfinder');
const mongoose = require('mongoose');
const app = express();

const url = `mongodb+srv://fullstack:${password}@cluster0.xgr0xci.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('dist'));  // Serve Vite build

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons);
    })
    .catch(error => {
      res.status(500).json({ error: 'Something went wrong' });
    });
});

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => {
      res.status(400).json({ error: 'malformatted id' });
    });
});

app.get('/info', (req, res) => {
  Person.countDocuments({})
    .then(count => {
      const requestTime = new Date();
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${requestTime}</p>
      `);
    })
    .catch(error => {
      res.status(500).json({ error: 'Something went wrong' });
    });
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({ error: 'name or number is missing' });
  }

  const person = new Person({
    name,
    number,
  });

  person.save()
    .then(savedPerson => {
      res.status(201).json(savedPerson);
    })
    .catch(error => {
      res.status(500).json({ error: 'Something went wrong' });
    });
});

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(error => {
      res.status(400).json({ error: 'malformatted id' });
    });
});

// Port configuration
portfinder.basePort = 3002;
portfinder.getPortPromise().then(PORT => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error(err);
});
