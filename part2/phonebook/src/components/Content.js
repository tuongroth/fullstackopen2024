import React from 'react';
import Person from './Person';

const Content = ({ personsToShow, deletePerson }) => {
  return (
    <ul>
      {personsToShow.map(person => (
        <Person key={person.id} person={person} deletePerson={deletePerson} />
      ))}
    </ul>
  );
};

export default Content;

