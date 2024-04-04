import React from 'react';
import PropTypes from 'prop-types';
import './CommentSection.css';

function CommentSection({
  comments, caption, profileImage, postUser,
}) {
  return (
    <div>
      <div className="commentSection">
        <div className="caption">
          <div className="postUser">
            <img src={profileImage} alt={`${postUser}'s profile`} />
            <div id="captionText">
              <h3>{postUser}</h3>
              <p>{caption}</p>
            </div>
          </div>
          <div />
        </div>
        {comments.map((comment) => {
          const profileImageUrl = comment.commenterProfileImage
            ? comment.commenterProfileImage
            : 'https://picsum.photos/200';
          return (
            <div key={comment.id}>
              {' '}
              <div className="userComment">
                <div className="commentedUser">
                  <img
                    src={profileImageUrl}
                    alt={`${comment.username}'s profile`}
                  />
                  <div id="commentText">
                    <h3>{comment.username}</h3>
                    <p>{comment.comment}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

CommentSection.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
      comment: PropTypes.string.isRequired,
    }),
  ).isRequired,
  caption: PropTypes.string.isRequired,
  profileImage: PropTypes.string.isRequired,
  postUser: PropTypes.string.isRequired,
};

export default CommentSection;
