import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import toggleHider from '../api/toggleHide'; // Import the API function for hiding/unhiding posts

// Basically I think I just need to pass a callback, which I will call in handleToggleHide
function HideButton({
  postId, hide, username, callback,
}) {
  const [loading, setLoading] = useState(false);
  const handleToggleHide = async () => {
    callback(postId);
    setLoading(true);
    try {
      await toggleHider(postId, hide, username);
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error toggling hide/unhide:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <button className="hide-button" onClick={handleToggleHide} disabled={loading}>
      <FontAwesomeIcon icon={hide ? faEye : faEyeSlash} />
    </button>
  );
}

HideButton.propTypes = {
  postId: PropTypes.string.isRequired,
  hide: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
};

export default HideButton;
