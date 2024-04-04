import React from 'react';
import PropTypes from 'prop-types';
import FollowButton from './FollowButton';
import './SearchResult.css';

export default function SearchResult({ searchResult }) {
  const searchResultUsername = searchResult.username;
  const searchResultProfImage = searchResult.profileImage;

  return (
    <div className="search-result" style={{ marginLeft: '160px' }}>
      <img src={searchResultProfImage} alt={searchResultUsername} className="profile-image" />
      <div className="user-details">
        <p className="username">{searchResultUsername}</p>
      </div>
      <FollowButton viewingUsername={searchResultUsername} />
    </div>
  );
}

SearchResult.propTypes = {
  searchResult: PropTypes.shape({
    profileImage: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
};
