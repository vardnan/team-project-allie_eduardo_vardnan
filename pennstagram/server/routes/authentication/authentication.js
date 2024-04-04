const jwt = require('jsonwebtoken');
const loginModel = require('../../models/authentication/login');
// import the env variables
require('dotenv').config();

const login = (req, res) => {
  const { username } = req.body;
  const { password } = req.body;
  loginModel(username, password, (err, data) => {
    if (data) {
      // res.send(data);
      // eslint-disable-next-line
      delete data.password;
      // const token = jwt.sign({ username }, 'abc', { expiresIn: '3600s' });
      // console.log('this si the env token in emitting ', process.env.KEY);
      const token = jwt.sign({ username }, process.env.KEY, { expiresIn: '3600s' });
      res.status(200).json({ userInfo: data, apptoken: token });
    } else {
      // eslint-disable-next-line
      console.log(`this is the err: ${err}`);
      res.status(400).send(err);
    }
  });
};

module.exports = login;
