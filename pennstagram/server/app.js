const path = require('path');
const express = require('express');
// import formidable
const formidable = require('formidable');
// import fs
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
// import S3 operations
const s3 = require('./s3/s3Operations');
const createPostRoute = require('./routes/createPost/createPost');
const deletePostRoute = require('./routes/deletePost/deletePost');
const loginRoute = require('./routes/authentication/authentication');
const signupRoute = require('./routes/registration/registration');
const activityFeedRoute = require('./routes/activityFeed/activityFeed');
const usrProfileRoute = require('./routes/userProfile/userProfileRoute');
const searchUserRoute = require('./routes/searchUser/searchUser');
const toggleLikeRoute = require('./routes/toggleLike/toggleLike');
const checkUsernameAvailabilityRoute = require('./routes/registration/usernameAvailability');
const updateUserFollowingRoute = require('./routes/userFollowing/updateUserFollowing');
const updatePostImageRoute = require('./routes/updatePostImage/updatePostImage');
const updatePostCaptionRoute = require('./routes/updatePostCaption/updatePostCaption');
const newCommentRoute = require('./routes/newComment/newComment');
const toggleHideRoute = require('./routes/toggleHide/toggleHide');
const followerCountRoute = require('./routes/getFollowers/getFollowers');

const app = express();
const port = process.env.PORT || 8080;
const server = http.createServer(app);
const io = new Server(server, {
  // pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    // credentials: true,
  },
});
io.on('connection', (socket) => {
  // Handle new post event
  socket.on('newPost', (newPost) => {
    // Broadcast the new post to all connected clients
    io.emit('newPost', newPost);
  });
  socket.on('newComment', (newComment) => {
    io.emit('newComment', newComment);
  });
  // Handle follower update event
  socket.on('followerUpdate', (username) => {
    // Broadcast the updated follower count to all connected clients
    io.emit('followerUpdate', username);
  });
});
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
  }),
);
// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies

// Deployment
// Static folder from frontend
app.use(express.static(path.join(__dirname, '../client/build')));

// // Define API routes

// login route
app.post('/login', (req, res) => {
  loginRoute(req, res);
});
// signup route
app.post('/signup', (req, res) => {
  signupRoute(req, res);
});
// activityFeed posts route
app.post('/activityFeedPosts', (req, res) => {
  activityFeedRoute(req, res);
});
// create post route
app.post('/posts', (req, res) => {
  createPostRoute(req, res);
});
// searchUser route
app.get('/searchUser', (req, res) => {
  searchUserRoute(req, res);
});
// checkUsernameAvailability route
app.get('/checkAvailability', (req, res) => {
  checkUsernameAvailabilityRoute(req, res);
});
// updateUserFollowing route
app.patch('/updateFollowing/:username/:targetUsername', (req, res) => {
  updateUserFollowingRoute(req, res);
});
// deletePost route
app.delete('/removePost/:postId', (req, res) => {
  // const postId = req.params.postId;
  deletePostRoute(req, res);
});
// updateImage route
app.patch('/updatePostImageUrl/:postId', (req, res) => {
  updatePostImageRoute(req, res);
});
// updateCaption route
app.patch('/imageCaption/:postId', (req, res) => {
  updatePostCaptionRoute(req, res);
});
// toggleLike route
app.patch('/toggleLike/:postId', (req, res) => {
  // print postId
  // console.log('Request Params:', req.params);
  toggleLikeRoute(req, res);
});
// newComment route
app.post('/posts/:postId/comments', (req, res) => {
  newCommentRoute(req, res);
});
// userProfile posts route
app.post('/userProfile', (req, res) => {
  usrProfileRoute(req, res);
});
// toggleHide route
app.patch('/toggleHide/:postId', (req, res) => {
  toggleHideRoute(req, res);
});
// Add the new follower count route
app.get('/user/:username/followers', (req, res) => {
  followerCountRoute(req, res);
});
// upload endpoint with formidable
app.post('/uploadImage/', async (req, res) => {
  const form = formidable({}); // { multiples: true });
  form.parse(req, (err, fields, files) => {
    // console.log('this is files', files);
    if (err) {
      // eslint-disable-next-line
      console.log('error', err.message);
      res.status(404).json({ error: err.message });
    }
    // create a buffer to cache uploaded file
    let cacheBuffer = Buffer.alloc(0);

    // create a stream from the virtual path of the uploaded file
    const fStream = fs.createReadStream(files.file.path);

    fStream.on('data', (chunk) => {
      // fill the buffer with data from the uploaded file
      cacheBuffer = Buffer.concat([cacheBuffer, chunk]);
    });

    fStream.on('end', async () => {
      // send buffer to AWS - The url of the object is returned
      const s3URL = await s3.uploadFile(cacheBuffer, files.file.name, false);
      // You can store the URL in mongoDB along with the rest of the data
      // send a response to the client
      res.status(201).json({ s3URL });
    });
  });
});
// upload endpoint with formidable
app.post('/uploadVideo/', async (req, res) => {
  const form = formidable({}); // { multiples: true });
  form.parse(req, (err, fields, files) => {
    // console.log('this is files', files);
    if (err) {
      // eslint-disable-next-line
      console.log('error', err.message);
      res.status(404).json({ error: err.message });
    }
    // create a buffer to cache uploaded file
    let cacheBuffer = Buffer.alloc(0);

    // create a stream from the virtual path of the uploaded file
    const fStream = fs.createReadStream(files.file.path);

    fStream.on('data', (chunk) => {
      // fill the buffer with data from the uploaded file
      cacheBuffer = Buffer.concat([cacheBuffer, chunk]);
    });

    fStream.on('end', async () => {
      // send buffer to AWS - The url of the object is returned
      const s3URL = await s3.uploadFile(cacheBuffer, files.file.name, true);
      // You can store the URL in mongoDB along with the rest of the data
      // send a response to the client
      res.status(201).json({ s3URL });
    });
  });
});

// Deployment
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = app;

if (require.main === module) {
  server.listen(port, () => {
    // eslint-disable-next-line
    console.log(`Server is running on port ${port}`);
  });
}
