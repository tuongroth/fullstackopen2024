import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = countries.filter(country =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries([]);
    }
  }, [search, countries]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      <h2>Country Information</h2>
      <div>
        Find countries: <input value={search} onChange={handleSearchChange} />
      </div>
      <CountriesList countries={filteredCountries} />
    </div>
  );
};

const CountriesList = ({ countries }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length > 1) {
    return (
      <ul>
        {countries.map(country => (
          <li key={country.cca3}>{country.name.common}</li>
        ))}
      </ul>
    );
  } else if (countries.length === 1) {
    return <CountryDetail country={countries[0]} />;
  } else {
    return <p>No matches found</p>;
  }
};

const CountryDetail = ({ country }) => (
  <div>
    <h2>{country.name.common}</h2>
    <p>Capital: {country.capital}</p>
    <p>Area: {country.area}</p>
    <h3>Languages:</h3>
    <ul>
      {Object.values(country.languages).map(language => (
        <li key={language}>{language}</li>
      ))}
    </ul>
    <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} width="200" />
  </div>
);

export default App;