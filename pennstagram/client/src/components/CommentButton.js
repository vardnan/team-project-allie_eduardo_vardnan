import React from 'react';
import PropTypes from 'prop-types';

function CommentButton({ setIsCommentButtonClicked }) {
  return (
    <div>
      <button type="button" onClick={setIsCommentButtonClicked}>
        Comment
      </button>
    </div>
  );
}

CommentButton.propTypes = {
  setIsCommentButtonClicked: PropTypes.func.isRequired,
};

export default CommentButton;
