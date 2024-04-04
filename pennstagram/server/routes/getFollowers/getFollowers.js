const fetchFollowerCount = require('../../models/getFollowers/followerCount');

const followerCountRoute = async (req, res) => {
  try {
    const { username } = req.params;
    const followersCount = await fetchFollowerCount(username);
    res.json({ followersCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = followerCountRoute;
