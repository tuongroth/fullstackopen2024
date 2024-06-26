import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CountriesList from './components/CountriesList';
import Country from './components/Country';
import Filter from './components/Filter';
import Button from './components/Button';
import CountryDetail from './components/CountryDetail';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
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
    setSelectedCountry(null); // Reset selected country when search changes
  };

  const handleShowCountryClick = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div>
      <h2>Country Information</h2>
      <Filter value={search} onChange={handleSearchChange} />
      
      {selectedCountry ? (
        <Country country={selectedCountry} />
      ) : (
        <CountriesList countries={filteredCountries} onItemClick={handleShowCountryClick} />
      )}

      {filteredCountries.length === 1 && !selectedCountry && (
        <Button onClick={() => setSelectedCountry(filteredCountries[0])} text="Show country" />
      )}
    </div>
  );
};

export default App;

