import React from 'react';

const Person = ({ person, deletePerson }) => {
  const handleDelete = () => {
    deletePerson(person.id); // Assuming person.id is the unique identifier
  };

  return (
    <div className="person">
      <p>Name: {person.name}</p>
      <p>Number: {person.number}</p>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default Person;

