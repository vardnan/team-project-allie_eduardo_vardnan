const updatePostModel = require('../../models/posts/updatePost');

const updatePostImageRoute = async (req, res) => {
  const { postId } = req.params;
  const updateData = {
    imageUrl: req.body.updatedImageUrl,
  };
  updatePostModel(postId, updateData, (result) => {
    if (result.acknowledged) {
      // Sending a 201 Created status code with the inserted document's data
      res.status(201).json(result);
    } else {
      // Sending a 500 Internal Server Error status code with the error message
      res.status(500).json({ message: 'Error updating post image' });
    }
  });
};

module.exports = updatePostImageRoute;
