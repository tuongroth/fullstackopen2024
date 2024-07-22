const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url =
  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url).then(() => {
  const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      required: true
    },
    number: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /\d{2,3}-\d{6,}/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    }
  });

  const Person = mongoose.model('Person', personSchema);

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person);
    });
    mongoose.connection.close();
  });
}).catch(error => {
  console.error('error connecting to MongoDB:', error.message);
});
