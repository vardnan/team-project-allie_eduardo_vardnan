import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './PhotoModal.css';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import CommentSection from './CommentSection';
import CommentInput from './CommentInput';

function PhotoModal({
  _id,
  isVideo,
  imageUrl,
  caption,
  username,
  profileImage,
  onClose,
  comments: initialComments,
  currentUser,
  likes: initialLikes,
  // added this
  // postId,
}) {
  const [comments, setComments] = useState(initialComments);
  const [likes] = useState(initialLikes);

  // console.log('Received postId:', postId);

  const fadeInOut = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  useEffect(() => {
    // const socket = io('http://localhost:8080');
    const socket = io('');
    // Listen for new comment events
    socket.on('newComment', (newComment) => {
      // eslint-disable-next-line
      // console.log('new comment received');
      // Update the comments state with the new comment
      setComments((prevComments) => [...prevComments, newComment]);
    });

    return () => {
      // Disconnect the socket when the component unmounts
      socket.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="photoModalWrapper"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={fadeInOut}
        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
      >
        <div className="photoModalImage">
        {isVideo ? (
          <video controls width="100%" height="100%">
            <source src={imageUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={imageUrl} alt={caption} />
        )}
        </div>
        <div className="photoModalSidePanel">
          <button className="closeButton" type="button" onClick={onClose}>
            X
          </button>
          <div className="sidePanelHeader">
            <img src={profileImage} alt={username} className="profileImg" />
            <h3>{username}</h3>
          </div>
          <div className="sidePanelComments">
            <CommentSection
              comments={comments}
              profileImage={profileImage}
              caption={caption}
              postUser={username}
            />
          </div>
          <div className="actionSection">
            <div className="actionButtonContainer">
              <div className="actionButtons">
              </div>
              <p>
                {likes.length}
                {' '}
                likes
              </p>
            </div>
            <div className="commentInput">
              <CommentInput
                postId = {_id.toString()}
                currentUser={currentUser}
                comments={comments}
                setComments={setComments}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

PhotoModal.propTypes = {
  isVideo: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  profileImage: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  comments: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  likes: PropTypes.array.isRequired,
  _id: PropTypes.string.isRequired,
};

export default PhotoModal;
