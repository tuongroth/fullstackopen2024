const mongoose = require('mongoose');


if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password> [name] [number]');
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.xgr0xci.mongodb.net/phonebook?retryWrites=true&w=majority`;


mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
    performOperations();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
  });


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

function performOperations() {
  if (process.argv.length === 3) {
    
    Person.find({})
      .then(persons => {
        console.log('phonebook:');
        persons.forEach(person => {
          console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
      })
      .catch(err => {
        console.error(err);
        mongoose.connection.close();
      });
  } else if (process.argv.length === 5) {
    
    const name = process.argv[3];
    const number = process.argv[4];

    const newPerson = new Person({ name, number });

    newPerson.save()
      .then(() => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
      })
      .catch(err => {
        console.error(err);
        mongoose.connection.close();
      });
  } else {
    console.log('Usage: node mongo.js <password> [name] [number]');
    mongoose.connection.close();
  }
}


