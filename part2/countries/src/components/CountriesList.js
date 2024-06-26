import React from 'react';

const CountriesList = ({ countries, onItemClick }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length > 1) {
    return (
      <ul>
        {countries.map(country => (
          <li key={country.cca3} onClick={() => onItemClick(country)}>
            {country.name.common}
          </li>
        ))}
      </ul>
    );
  } else if (countries.length === 1) {
    return null; // No need to render list if only one country
  } else {
    return <p>No matches found</p>;
  }
};

export default CountriesList;
