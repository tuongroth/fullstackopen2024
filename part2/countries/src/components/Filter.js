// src/components/Filter.js
import React from 'react';
import Button from './Button';

const Filter = ({ search, handleSearchChange, filteredCountries, onShowCountry }) => {
  return (
    <div>
      <div>
        Find countries: <input value={search} onChange={handleSearchChange} />
      </div>
      <CountriesList countries={filteredCountries} onShowCountry={onShowCountry} />
    </div>
  );
};

const CountriesList = ({ countries, onShowCountry }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length > 1) {
    return (
      <ul>
        {countries.map(country => (
          <li key={country.cca3}>
            {country.name.common} 
            <Button onClick={() => onShowCountry(country)} text="Show" />
          </li>
        ))}
      </ul>
    );
  } else if (countries.length === 1) {
    return <Country country={countries[0]} />;
  } else {
    return <p>No matches found</p>;
  }
};

export default Filter;
