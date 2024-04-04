// routes/toggleHide/toggleHide.js

const toggleHideModel = require('../../models/toggleHide/toggleHide');

const toggleHideRoute = async (req, res) => {
  const { postId } = req.params;
  const { hide, username } = req.body; // Add username to the request body
  try {
    // Pass username along with postId and hide to the model function
    const result = await toggleHideModel(postId, username, hide);
    res.json(result);
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error toggling hide/unhide:', error);
    res.status(500).json({ error: 'An error occurred while toggling hide/unhide' });
  }
};

module.exports = toggleHideRoute;
