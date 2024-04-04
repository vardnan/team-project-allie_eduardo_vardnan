import React, { useState } from 'react';
import SearchResult from './SearchResult';
import './SearchBar.css';
import { searchUserByUsername } from '../api/searchUser';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = async () => {
    try {
      const foundUser = await searchUserByUsername(searchTerm);
      if (foundUser) {
        setSearchResult(foundUser);
      } else {
        setSearchResult(null);
        // eslint-disable-next-line
        console.log('User not found');
      }
    } catch (error) {
      setSearchResult(null);
      // eslint-disable-next-line
      console.log('An error ocurred (see error message in next console print)', error);
      // eslint-disable-next-line
      console.error('Error searching user:', error.response.data.message);
      // eslint-disable-next-line
      alert(error.response.data.message);
      if (error.response.data.message.includes('token')) {
        // delete the JWT
        localStorage.removeItem('app-token');
        localStorage.removeItem('username');
        // relaunch the app
        window.location.reload(true);
      }
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResult(null);
  };

  const handleClearSearchKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      clearSearch();
    }
  };

  return (
    <div className="search-bar">
      <h2>Search</h2>
      <div className="search-input">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <span
            className="clear-button"
            onClick={clearSearch}
            onKeyDown={handleClearSearchKeyPress}
            role="button"
            tabIndex={0}
            aria-label="Clear search"
          >
            &#10005;
          </span>
        )}
      </div>
      <button type="button" onClick={handleSearch}>
        Search
      </button>

      {searchResult && <SearchResult searchResult={searchResult} />}
    </div>
  );
}

export default SearchBar;
