import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import submitComments from '../api/submitComment';

function CommentInput({
  postId,
  currentUser,
  // comments,
  // setComments,
}) {
  const [comment, setComment] = useState('');
  const textAreaRef = useRef(null);
  // const socket = io('http://localhost:8080');
  const socket = io('');

  const onSubmit = async () => {
    if (comment.trim() !== '') {
      const newCommentData = {
        username: currentUser.username,
        comment,
        commenterProfileImage: currentUser.profileImage,
        id: Math.random(),
      };

      try {
        await submitComments(postId, newCommentData);
        // Emit a new comment event to the backend
        socket.emit('newComment', newCommentData);
      } catch (err) {
        throw new Error(err);
      }

      // setComments([...comments, newCommentData]);
      setComment('');
    }
  };

  const keyDownHandler = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <div>
      <textarea
        value={comment}
        ref={textAreaRef}
        onChange={(e) => setComment(e.target.value)}
        type="text"
        placeholder="Add a comment"
        onKeyDown={keyDownHandler}
      />
    </div>
  );
}

CommentInput.propTypes = {
  postId: PropTypes.isRequired,
  currentUser: PropTypes.object.isRequired,
  // comments: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     username: PropTypes.string.isRequired,
  //     comment: PropTypes.string.isRequired,
  //   }),
  // ).isRequired,
  setComments: PropTypes.func.isRequired,
};

export default CommentInput;
