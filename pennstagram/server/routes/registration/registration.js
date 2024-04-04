const jwt = require('jsonwebtoken');
const signupModel = require('../../models/registration/signup');
// import the env variables
require('dotenv').config();

const signup = (req, res) => {
  const userData = req.body;
  signupModel(userData, (err, data) => {
    if (data) {
      // res.send(data);
      // const token = jwt.sign({ username }, process.env.KEY, { expiresIn: '3600s' });
      const token = jwt.sign({ username: userData.username }, process.env.KEY, { expiresIn: '3600s' });
      res.status(200).json({ userInfo: data, apptoken: token });
    } else {
      res.status(500).json({ message: 'Signup failed. Please try again later.' });
    }
  });
};

module.exports = signup;
