import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import { UserContext } from '../contexts/user-context';
import './UserProfile.css';
import io from 'socket.io-client';
import PhotoModal from './PhotoModal';
import FollowButton from './FollowButton';
import fetchFeedPosts from '../api/userProfile'; // Corrected import
import fetchFollowerCounts from '../api/fetchFollowers';

export default function UserProfile() {
  const [photoData, setPhotoData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  // const { currentUser, viewingUser } = useContext(UserContext);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const viewingUser = JSON.parse(localStorage.getItem('viewingUser'));
  const [followersCount, setFollowersCount] = useState(0); // New state

  useEffect(() => {
    // const socket = io('http://localhost:8080');
    const socket = io('');
    const fetchPosts = async () => {
      try {
        const userPosts = await fetchFeedPosts(viewingUser.username);
        setPosts(userPosts);
      } catch (error) {
        // console.error('Error fetching posts:', error);
        // eslint-disable-next-line
        console.log('An error ocurred', error);
        // Case when error is due to token
        if (error.response) {
          // eslint-disable-next-line
          console.error('Error fetching activityFeedPosts:', error.response.data.message);
          // eslint-disable-next-line
          alert(error.response.data.message);
          // detele the JWT
          localStorage.removeItem('app-token');
          localStorage.removeItem('username');
          // relaunch the app
          window.location.reload(true);
        }
      }
    };

    fetchPosts();

    // Fetch the initial follower count
    setFollowersCount(viewingUser.followers.length);

    // Listen for follower updates
    const handleFollowerUpdate = async (username) => {
      if (username.username === viewingUser.username) {
        try {
          const response = await fetchFollowerCounts(viewingUser.username);
          // eslint-disable-next-line
          // console.log(response.followersCount);
          setFollowersCount(response.followersCount);
        } catch (error) {
          // eslint-disable-next-line
          console.error('Error fetching follower count:', error.message);
        }
      } else {
        // eslint-disable-next-line
        console.log("didn't happen");
      }
    };

    socket.on('followerUpdate', handleFollowerUpdate);

    // Cleanup socket event listener
    return () => {
      socket.off('followerUpdate', handleFollowerUpdate);
    };
  }, []);

  const userProfilePostHandler = (post) => {
    setPhotoData({
      ...post,
      username: viewingUser.username,
      profileImage: viewingUser.profileImage,
      // eslint-disable-next-line
      currentUser: currentUser,
    });
    setIsModalOpen(true);
  };

  const userPostsDisplay = posts.map((post, index) => (
    <div
      key={`post-${post.id || index}`}
      className="userPost"
      role="button" // Add role="button" to make it interactive
      onClick={() => userProfilePostHandler(post)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          userProfilePostHandler(post);
        }
      }}
      tabIndex={0} // Add tabIndex to make it keyboard accessible
    >
      {post.isVideo ? (
        <video width="250" height="250">
          <source src={post.imageUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img src={post.imageUrl} alt={post.caption} />
      )}
    </div>
  ));

  return (
    <div className="userProfile">
      {isModalOpen && (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <PhotoModal onClose={() => setIsModalOpen(false)} {...photoData} />
      )}
      <div id={isModalOpen ? 'blurEffect' : undefined}>
        <div className="userProfileHeader">
          <img
            src={viewingUser.profileImage}
            alt="User Profile"
            className="profilePic"
          />
          <div>
            <h3>{viewingUser.username}</h3>
            <div className="profileInformation">
              <ul>
                <li>{`${posts.length} posts`}</li>
                <li>{`${followersCount} followers`}</li>
                <li>{`${viewingUser.following.length} following`}</li>
              </ul>
            </div>
            <p className="bio">{viewingUser.bio}</p>
            {currentUser.username !== viewingUser.username && (
              <FollowButton viewingUsername={viewingUser.username} />
            )}
          </div>
        </div>
        <div className="userProfilePosts">{userPostsDisplay}</div>
      </div>
    </div>
  );
}

UserProfile.propTypes = {
  viewingUsername: PropTypes.string,
  image: PropTypes.string,
  caption: PropTypes.string,
  username: PropTypes.string,
};
