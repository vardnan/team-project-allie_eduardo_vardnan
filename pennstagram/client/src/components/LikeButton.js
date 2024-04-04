import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './LikeButton.css';
import { toggleLike } from '../api/toggleLike';

function LikeButton({ currentUser, likes, postId }) {
  // add line testing if postLikes are recieved from activity feed
  const [isLiked, setIsLiked] = useState(likes.includes(currentUser.username));

  const likeHandler = async () => {
    try {
      if (isLiked) {
        setIsLiked(false);
        likes.pop();
        await toggleLike(postId, currentUser, false); // API call to unlike the post
      } else {
        setIsLiked(true);
        likes.push(currentUser.username);
        await toggleLike(postId, currentUser, true); // API call to like the post
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error toggling like:', error);
      // Handle the error if needed
    }
  };

  return (
    <div className='buttonBox'>
      <button
        type="button" // Add the type attribute with the value "button"
        id={isLiked ? 'liked' : 'unliked'}
        className="likeButton"
        onClick={likeHandler}
        data-cy="like-button"
      >
        {isLiked ? 'Unlike' : 'Like'}
      </button>
      <p className='likeNumber'>{likes.length}</p>
    </div>
  );
}

LikeButton.propTypes = {
  currentUser: PropTypes.object.isRequired,
  likes: PropTypes.array.isRequired,
  postId: PropTypes.string.isRequired,
};

export default LikeButton;
