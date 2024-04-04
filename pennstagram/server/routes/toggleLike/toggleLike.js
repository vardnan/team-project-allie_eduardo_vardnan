// toggleLike.js

const toggleLikeModel = require('../../models/toggleLike/toggleLike');

const toggleLikeRoute = async (req, res) => {
  const { postId } = req.params;
  const { currUsername } = req.body;
  const { like } = req.body;

  try {
    const result = await toggleLikeModel(postId, currUsername, like);
    res.json(result);
  } catch (error) {
    // console.error('Error toggling like:', error);
    res.status(500).json({ error: 'An error occurred while toggling like' });
  }
};

module.exports = toggleLikeRoute;
