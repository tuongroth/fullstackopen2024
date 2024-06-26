import React, { useState, useEffect } from 'react';
import personsService from './services/persons'; 
import './styles.css'; 
import Notification from './Notification'; 

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [notification, setNotification] = useState(null);

  
  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  
  const addOrUpdatePerson = (event) => {
    event.preventDefault();

    
    const existingPerson = persons.find(person => person.name === newName);

   
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to the phonebook. Replace the old number with a new one?`)) {
        const changedPerson = { ...existingPerson, number: newNumber };

        personsService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person =>
              person.id !== existingPerson.id ? person : returnedPerson
            ));
            setNewName('');
            setNewNumber('');
            setNotification(`Updated ${newName}`);
            setTimeout(() => {
              setNotification(null);
            }, 5000);
          })
          .catch(error => {
            console.error('Error updating person:', error);
            setNotification(`Error updating ${newName}`);
            setTimeout(() => {
              setNotification(null);
            }, 5000);
          });
      }
    } else {
     
      const newPerson = {
        name: newName,
        number: newNumber,
      };

      personsService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setNotification(`Added ${newName}`);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch(error => {
          console.error('Error adding person:', error);
          setNotification(`Error adding ${newName}`);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        });
    }
  };

  
  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          setNotification(`Deleted ${name}`);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch(error => {
          console.error('Error deleting person:', error);
          setNotification(`Error deleting ${name}`);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        });
    }
  };

  
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <form onSubmit={addOrUpdatePerson}>
        <div>
          Name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          Number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">Add / Update</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map(person => (
          <li key={person.id}>
            {person.name} {person.number}
            <button onClick={() => deletePerson(person.id, person.name)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
