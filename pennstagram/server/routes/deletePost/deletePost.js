const deletePostModel = require('../../models/posts/deletePost');

const deletePostRoute = (req, res) => {
  // eslint-disable-next-line
  const postId = req.params.postId;
  deletePostModel(postId, (result) => {
    if (result.deletedCount > 0) {
      // Sending a 201 Created status code with the inserted document's data
      res.status(201).json(result);
    } else {
      res.status(400).json({ message: 'Error deleting post' });
    }
  });
};

module.exports = deletePostRoute;
