const searchUserByUsername = require('../../models/searchUser/searchUser');
const verifyUser = require('../../utils/auth');

const searchUser = async (req, res) => {
  const { username } = req.query;
  if (await verifyUser(req.headers.authorization)) {
    try {
      const foundUser = await searchUserByUsername(username);
      if (foundUser) {
        res.json(foundUser);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      // console.error('Error searching for user:', error);
      res.status(500).json({ error: 'An error occurred while searching for the user' });
    }
  } else {
    res.status(401).json({ message: 'Failed Authentication, reasons include: expired token...' });
  }
};

module.exports = searchUser;
