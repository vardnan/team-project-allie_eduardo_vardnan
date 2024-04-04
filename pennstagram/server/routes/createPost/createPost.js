const newPostModel = require('../../models/createPost/newPost');
const verifyUser = require('../../utils/auth');

const createPost = async (req, res) => {
  const postData = req.body;
  if (!(await verifyUser(req.headers.authorization))) {
    res.status(401).json({ message: 'Failed Authentication, reasons include: expired token...' });
  } else {
    newPostModel(postData, (result) => {
      if (result.acknowledged && postData.poster) {
        // Sending a 201 Created status code with the inserted document's data
        res.status(201).json(result);
      } else {
        // Sending a 500 Internal Server Error status code with the error message
        res.status(400).json({ message: 'Error creating post' });
      }
    });
  }
};

module.exports = createPost;
