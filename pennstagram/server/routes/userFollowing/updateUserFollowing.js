const updateUserFollowing = require('../../models/userFollowing/updateUserFollowing');

const updateFollowing = async (req, res) => {
  const { username, targetUsername } = req.params; // Extract user ID from the request URL
  const { updatedFollowing } = req.body; // Extract the updated following data

  try {
    const response = await updateUserFollowing(username, targetUsername, updatedFollowing);
    res.status(201).json(response); // Respond with the updated user's following
  } catch (error) {
    // console.error('Error updating user following:', error);
    res.status(500).json({ error: 'An error occurred while updating user following' });
  }
};

module.exports = updateFollowing;
