const checkUsernameAvailability = require('../../models/registration/usernameAvailability');

const checkAvailability = async (req, res) => {
  const { username } = req.query;

  try {
    const isAvailable = await checkUsernameAvailability(username);
    res.json({ isAvailable });
  } catch (error) {
    // console.error('Error checking username availability:', error);
    res.status(500).json({ error: 'An error occurred while checking username availability' });
  }
};

module.exports = checkAvailability;
