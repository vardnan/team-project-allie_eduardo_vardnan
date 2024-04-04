// import JWT
const jwt = require('jsonwebtoken');
// import the env variables
require('dotenv').config();

/**
 * Verify a token. Check if the user is valid
 * @param {*} token
 * @returns true if the user is valid
 */
// Eduardo note: this seems to be doing some verification on the token,
// like checking that the key/secret matches or something.
const verifyUser = async (token) => {
  try {
    // decoded contains the paylod of the token
    // const decoded = jwt.verify(token, process.env.KEY);
    // RUBRIC: JWT are validated correctly: expired token are rejected
    // const decoded = jwt.verify(token, 'abc');
    // console.log('this is the env token in authenticating ', process.env.KEY);
    const decoded = jwt.verify(token, process.env.KEY);
    // eslint-disable-next-line
    console.log('payload', decoded);
    // Eduardo note: I don't think i need the below
    // // check that the payload contains a valid user
    // const user = await getStudentByName(decoded.username);
    // if(!user){
    //     // user is undefined
    //     return false;
    // }
    return true;
  } catch (err) {
    // invalid token, e.g. expired token
    // eslint-disable-next-line
    console.log('error', err.message);
    return false;
  }
};

module.exports = verifyUser;
