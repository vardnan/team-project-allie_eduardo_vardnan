import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
// import { UserContext } from '../contexts/user-context';
import './HiddenPosts.css';
import fetchFeedPosts from '../api/activityFeedPosts'; // Corrected import
import searchByUsername from '../api/searchUser';
import deletePostApi from '../api/deletePost';
import updatePostImageUrls from '../api/updatePostImageUrl';
import updatePostCaptions from '../api/updatePostCaption';

// edits
import LikeButton from './LikeButton';

import HideButton from './HideButton';

function HiddenPosts() {
  // const { currentUser, setViewingUser } = useContext(UserContext);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [feedPosts, setFeedPosts] = useState([]);
  const navigate = useNavigate();
  const [editImageMode, setEditImageMode] = useState(null);
  const [editCaptionMode, setEditCaptionMode] = useState(null);
  const [updatedImageUrl, setUpdatedImageUrl] = useState('');
  const [updatedCaption, setUpdatedCaption] = useState('');

  useEffect(() => {
    const loadFeedPosts = async () => {
      try {
        const userFollowedPosts = await fetchFeedPosts(currentUser.following, currentUser.username);
        setFeedPosts(userFollowedPosts);
      } catch (error) {
        // eslint-disable-next-line
        console.error('Error loading feed posts:', error);
      }
    };

    loadFeedPosts();
  }, []);

  const userProfileHandler = (posterUsername) => {
    const findUser = async () => {
      try {
        const clickedUser = await searchByUsername(posterUsername);
        if (clickedUser) {
          // setViewingUser(clickedUser);
          localStorage.setItem('viewingUser', JSON.stringify(clickedUser));
          navigate('/profile');
        }
      } catch (err) {
        // eslint-disable-next-line
        console.error('Error finding clicked user: ', err);
      }
    };
    findUser();
  };

  const deletePost = async (_postId) => {
    try {
      // eslint-disable-next-line
      setFeedPosts((prevPosts) => prevPosts.filter((post) => post._id !== _postId));
      // eslint-disable-next-line
      deletePostApi(_postId)
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error deleting post:', error);
    }
  };

  // edit
  const hidePost = (postId) => {
    // Update the state to reflect the changes locally
    // eslint-disable-next-line
    const updatedFeedPosts = feedPosts.filter((post) => post._id !== postId);
    setFeedPosts(updatedFeedPosts);
  };

  const handleEditClick = (postId) => {
    setEditImageMode(!editImageMode ? postId : null);
    // eslint-disable-next-line
    const post = feedPosts.find((post) => post._id === postId);
    setUpdatedImageUrl(post.imageUrl);
  };

  const handleUpdateImage = (postId) => {
    const updatedFeedPosts = [...feedPosts];
    // eslint-disable-next-line
    const postIndex = updatedFeedPosts.findIndex((post) => post._id === postId);
    if (postIndex !== -1) {
      updatedFeedPosts[postIndex].imageUrl = updatedImageUrl;
      setFeedPosts(updatedFeedPosts);
    }
    setEditImageMode(null);
    updatePostImageUrls(postId, updatedImageUrl);
  };

  const handleCaptionEditClick = (postId) => {
    setEditCaptionMode(!editCaptionMode ? postId : null);
    // eslint-disable-next-line
    const post = feedPosts.find((post) => post._id === postId);
    setUpdatedCaption(post.caption);
  };

  const handleUpdateCaption = (postId) => {
    const updatedFeedPosts = [...feedPosts];
    // eslint-disable-next-line
    const postIndex = updatedFeedPosts.findIndex((post) => post._id === postId);
    if (postIndex !== -1) {
      updatedFeedPosts[postIndex].caption = updatedCaption;
      setFeedPosts(updatedFeedPosts);
    }
    setEditCaptionMode(null);
    updatePostCaptions(postId, updatedCaption);
  };

  return (
    <div id="activity-feed" data-testid="activity-feed" style={{ marginLeft: '160px' }}>
      {feedPosts.map((post) => (
        // eslint-disable-next-line
        <div key={post._id}>
        {post.hiddenBy.includes(currentUser.username) && (
        // eslint-disable-next-line
        <div key={post._id} id="feed-post">
          <div id="feed-post-header">
            <img
              id="feed-post-profileImage"
              src={
                post.posterProfileImage
              }
              alt="Profile"
            />
            <h4
              onClick={() => userProfileHandler(post.poster)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  userProfileHandler(post.poster);
                }
              }}
              id="feed-post-poster"
              tabIndex="0"
              role="button"
            >
              {post.poster}
            </h4>
            {currentUser.username === post.poster && (
              <div className="icon-container">
                <FontAwesomeIcon
                  icon={faTrash}
                  className="trash"
                  // eslint-disable-next-line
                  onClick={() => deletePost(post._id)}
                />
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  className="pencil"
                  // eslint-disable-next-line
                  onClick={() => handleEditClick(post._id)}
                />
              </div>
            )}
            {currentUser.username !== post.poster && (
              <div className="icon-container" style={{ marginLeft: '250px' }}>
                <HideButton
                  // eslint-disable-next-line
                  postId={post._id}
                  hide={!post.hiddenBy.includes(currentUser.username)}
                  username={currentUser.username}
                  callback={hidePost}
                />
              </div>
            )}
          </div>
          <div className="feed-post-media-container">
            {// eslint-disable-next-line
            editImageMode === post._id ? (
              <div className="edit-post">
                <input
                  type="text"
                  value={updatedImageUrl}
                  onChange={(e) => setUpdatedImageUrl(e.target.value)}
                />
                <button onClick={() => {
                  // eslint-disable-next-line
                  handleUpdateImage(post._id);
                }}>
                  {post.isVideo ? 'Update Video' : 'Update Image' }
                </button>
              </div>
            ) : null}
            {post.isVideo ? (
              <iframe
                id="feed-post-video"
                src={post.imageUrl}
                frameBorder="0"
                allowFullScreen
                title="Post Video"
              />
            ) : (
              <img id="feed-post-post" src={post.imageUrl} alt="Post" />
            )}
          </div>
          <div className='bottom-post-part'>
            <div className='bottom-caption-icon-part'>
              <p id="feed-post-caption">{post.caption}</p>
              {currentUser.username === post.poster
              && <div className="icon-container">
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  className="bottom-pencil"
                  onClick={() => {
                    // eslint-disable-next-line
                    handleCaptionEditClick(post._id)
                  }}/>
              </div>
            }
            </div>
            {// eslint-disable-next-line
            editCaptionMode === post._id ? (
              <div className="edit-post">
                <input
                  type="text"
                  value={updatedCaption}
                  onChange={(e) => setUpdatedCaption(e.target.value)}
                />
                <button onClick={() => {
                  // eslint-disable-next-line
                  handleUpdateCaption(post._id)
                }}>
                  Update Caption
                </button>
              </div>
            ) : null}
          </div>
          <LikeButton
            currentUser={currentUser}
            likes={post.likes}
            // eslint-disable-next-line
            postId={post._id} // Pass post._id directly to LikeButton
          />
        </div>
        )}
        </div>
      ))}
    </div>
  );
}

export default HiddenPosts;
