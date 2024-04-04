import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { UserContext } from '../contexts/user-context';
import './ActivityFeed.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import io from 'socket.io-client';
import fetchFeedPosts from '../api/activityFeedPosts'; // Corrected import
import searchByUsername from '../api/searchUser';
import deletePostApi from '../api/deletePost';
import updateImageUrl from '../api/updatePostImageUrl';
import updateCaption from '../api/updatePostCaption';

// edits
import LikeButton from './LikeButton';

import HideButton from './HideButton';

function ActivityFeed() {
  // const { currentUser, setViewingUser } = useContext(UserContext);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [feedPosts, setFeedPosts] = useState([]);
  const navigate = useNavigate();
  const [editImageMode, setEditImageMode] = useState(null);
  const [editCaptionMode, setEditCaptionMode] = useState(null);
  const [updatedImageUrl, setUpdatedImageUrl] = useState('');
  const [updatedCaption, setUpdatedCaption] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const LIMIT = 8;

  useEffect(() => {
    const loadFeedPosts = async () => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        // eslint-disable-next-line
        // console.log('here in loadFeedPosts!');
        const userFollowedPosts = await fetchFeedPosts(
          currentUser.following,
          currentUser.username,
          currentPage,
          LIMIT,
        );
        setFeedPosts((prevPosts) => [...prevPosts, ...userFollowedPosts]);
        setHasMore(userFollowedPosts.length === LIMIT);
      } catch (error) {
        // console.error('Error loading feed posts:', error);
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
      } finally {
        setIsLoading(false);
      }
    };
    loadFeedPosts();
  }, [currentPage]);

  useEffect(() => {
    // const socket = io('http://localhost:8080');
    const socket = io(''); // Replace with your backend URL

    // Example: Listen for new posts
    socket.on('newPost', (data) => {
      // eslint-disable-next-line
      // console.log('recieved post');
      // eslint-disable-next-line
      console.log(data);

      const loadFeedPosts = async () => {
        try {
          const userFollowedPosts = await
          fetchFeedPosts(currentUser.following, currentUser.username);
          setFeedPosts(userFollowedPosts);
        } catch (error) {
          // eslint-disable-next-line
          console.error('Error loading feed posts:', error);
        }
      };
      loadFeedPosts();
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser]);

  const loadMorePosts = () => {
    if (!isLoading) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

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
      deletePostApi(_postId);
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
    const post = feedPosts.find((postInstance) => postInstance._id === postId);
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
    updateImageUrl(postId, updatedImageUrl);
  };

  const handleCaptionEditClick = (postId) => {
    setEditCaptionMode(!editCaptionMode ? postId : null);
    // eslint-disable-next-line
    const post = feedPosts.find((postInstance) => postInstance._id === postId);
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
    updateCaption(postId, updatedCaption);
  };

  return (
    <div id="activity-feed" data-testid="activity-feed">
      <InfiniteScroll
        dataLength={feedPosts.length}
        next={loadMorePosts}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        {feedPosts.map((post) => (
          // eslint-disable-next-line
          <div key={post._id}>
        {!post.hiddenBy.includes(currentUser.username) && (
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
                    handleUpdateImage(post._id)
                  }}>
                    {post.isVideo ? 'Update Video' : 'Update Image' }
                  </button>
                </div>
              ) : null}
              {post.isVideo ? (
                // <iframe
                //   id="feed-post-video"
                //   src={post.imageUrl}
                //   frameBorder="0"
                //   allowFullScreen
                //   title="Post Video"
                // />
                <video controls width="500" height="400">
                  <source src={post.imageUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
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
      </InfiniteScroll>
    </div>
  );
}

export default ActivityFeed;
