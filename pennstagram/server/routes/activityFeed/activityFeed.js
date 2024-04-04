const followingPosts = require('../../models/activityFeed/posts');
const verifyUser = require('../../utils/auth');

const followingPostsRoute = async (req, res) => {
  // console.log('this is the header', req.headers.authorization);
  if (await verifyUser(req.headers.authorization)) {
    const {
      currUserUsername, usernames, page, limit,
    } = req.body;
    followingPosts(usernames, currUserUsername, page, limit, (err, data) => {
      if (data) {
        res.send(data);
      } else {
        res.send(err);
      }
    });
  } else {
    res.status(401).json({ message: 'Failed Authentication, reasons include: expired token...' });
  }
};

module.exports = followingPostsRoute;
