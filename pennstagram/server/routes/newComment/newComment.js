const newCommentModel = require('../../models/comment/comment');

const newComment = (req, res) => {
  const { postId } = req.params;
  const newCommentData = req.body;

  newCommentModel(postId, newCommentData, (result) => {
    if (result.acknowledged) {
      // Sending a 201 Created status code with the inserted document's data
      res.status(201).json(result);
    } else {
      // Sending a 500 Internal Server Error status code with the error message
      res.status(500).json({ message: 'Error creating post' });
    }
  });
};

module.exports = newComment;
