const peopleRouter = require('express').Router();
const Person = require('../models/person');

peopleRouter.get('/', async (req, res) => {
  const people = await Person.find({});
  res.json(people);
});

peopleRouter.post('/', async (req, res) => {
  const body = req.body;

  const person = new Person({
    name: body.name,
    phone: body.phone,
  });

  const savedPerson = await person.save();
  res.status(201).json(savedPerson);
});

module.exports = peopleRouter;
