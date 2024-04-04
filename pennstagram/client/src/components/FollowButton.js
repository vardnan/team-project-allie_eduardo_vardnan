import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import { UserContext } from '../contexts/user-context';
import io from 'socket.io-client';
import { updateUserFollowing } from '../api/updateUserFollowing';

function FollowButton({ viewingUsername }) {
  // const { currentUser, setCurrentUser } = useContext(UserContext);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  // const socket = io('http://localhost:8080');
  const socket = io('');

  const [isFollowing, setIsFollowing] = useState(
    currentUser.following
      ? currentUser.following.includes(viewingUsername)
      : false,
  );

  const toggleFollow = async () => {
    try {
      let updatedFollowingList = [];

      if (isFollowing) {
        // If already following, unfollow
        updatedFollowingList = currentUser.following.filter(
          (username) => username !== viewingUsername,
        );
        // console.log('this is the following list now');
        // console.log(currentUser.username);
        // console.log(viewingUsername);
        // console.log(updatedFollowingList);
      } else {
        // If not following, follow
        updatedFollowingList = currentUser.following
          ? [...currentUser.following, viewingUsername] : [viewingUsername];
      }

      // Update the user's following list using the new function
      // await updateUserFollowing(currentUser.username, updatedFollowingList);

      // Update the user's following list using the new function
      // eslint-disable-next-line
      // console.log(currentUser.username);
      // eslint-disable-next-line
      // console.log(viewingUsername);
      try {
        await updateUserFollowing(currentUser.username, viewingUsername, updatedFollowingList);
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }

      // Emit a follower update event
      socket.emit('followerUpdate', {
        username: viewingUsername,
      });

      // Toggle the isFollowing state
      setIsFollowing(!isFollowing);
      // setCurrentUser({
      //   ...currentUser,
      //   following: updatedFollowingList,
      // });
      currentUser.following = updatedFollowingList;
      localStorage.setItem('user', JSON.stringify(currentUser));
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error toggling follow:', error);
    }
  };

  return (
    <div>
      <button type="button" onClick={toggleFollow}>
        {' '}
        {/* Add type="button" */}
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
}

FollowButton.propTypes = {
  viewingUsername: PropTypes.string.isRequired,
};

export default FollowButton;
