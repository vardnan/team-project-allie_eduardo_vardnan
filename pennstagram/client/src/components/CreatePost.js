import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Paper,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// import { UserContext } from '../contexts/user-context';
import './CreatePost.css';
import io from 'socket.io-client';
import { createPost } from '../api/createPost'; // Import the API function
import { uploadFile } from '../api/uploadImage';
import { uploadVideo } from '../api/uploadVideo';

// const socket = io('http://localhost:8080');
const socket = io('');

const useStyles = styled(() => ({
  root: {
    flexGrow: 1,
    padding: 2,
    marginLeft: '500px',
  },
  textField: {
    marginBottom: 2,
  },
  button: {
    marginTop: 2,
  },
}));

function CreatePost() {
  const classes = useStyles();
  // const [imageURL, setImageURL] = useState('');
  const [caption, setCaption] = useState('');
  const [isVideo, setIsVideo] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  // const { currentUser } = useContext(UserContext);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();

    // Check if a file is selected
    if (!selectedFile) {
      // eslint-disable-next-line
      alert('Please choose a file.');
      return;
    }

    // Check if the selected file is an image or video
    const fileType = selectedFile.type.split('/')[0];
    // console.log('This is the fileType', fileType);
    if (fileType !== 'image' && fileType !== 'video') {
      // eslint-disable-next-line
      alert('Please choose a valid image or video file.');
      return;
    }

    // Check if the selected file is a JPEG image
    if (fileType === 'image' && selectedFile.type.toLowerCase() !== 'image/jpeg') {
      // eslint-disable-next-line
      alert('Please choose a valid JPEG image file.');
      return;
    }

    // Check the file size based on the file type
    const maxSize = fileType === 'image' ? 3 * 1024 * 1024 : 50 * 1024 * 1024; // 3MB for images, 50MB for videos
    // console.log('This is the file size', selectedFile.size);
    if (selectedFile.size > maxSize) {
      // eslint-disable-next-line
      alert(`File size exceeds the maximum allowed size (${maxSize / (1024 * 1024)} MB).`);
      return;
    }

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', selectedFile);

    const postData = {
      poster: currentUser.username,
      caption,
      timeOfPost: formattedDate,
      comments: [],
      likes: [],
      isVideo,
      posterProfileImage: currentUser.profileImage,
      hiddenBy: [],
    };

    try {
      if (isVideo) {
        const res = await uploadVideo(formData);
        // console.log('this is the link: ', res.data.s3URL);
        postData.imageUrl = res.data.s3URL;
      } else {
        const res = await uploadFile(formData);
        // console.log('this is the link: ', res.data.s3URL);
        postData.imageUrl = res.data.s3URL;
      }
      const response = await createPost(postData); // Use the createPost function
      // eslint-disable-next-line
      console.log(response); // Remove or comment out this console.log
      // Emit event to the server
      socket.emit('newPost', postData);
      // After successful upload, you can redirect or update the UI accordingly.
      // setImageURL('');
      setCaption('');
      setSelectedFile(null); // Reset the selected file state
    } catch (error) {
      // console.error('Error creating the post:', error);
      // eslint-disable-next-line
      console.log('An error ocurred (see error message in next console print)', error);
      // eslint-disable-next-line
      console.error('Error creating post:', error.response.data.message);
      // eslint-disable-next-line
      alert(error.response.data.message);
      // detele the JWT
      localStorage.removeItem('app-token');
      localStorage.removeItem('username');
      // relaunch the app
      window.location.reload(true);
    }
  };

  return (
    <Grid className="create-post">
      <Grid item xs={12} md={6}>
        <Paper>
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              accept="image/jpeg video/*" // Specify the accepted file types, e.g., images
              className={classes.textField}
              required
              data-cy='image-file'
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Caption"
              multiline
              rows={4}
              onChange={(e) => setCaption(e.target.value)}
              value={caption}
              className={classes.textField}
              data-cy='image-caption'
            />
            <FormControlLabel
              control={(
                <Checkbox
                  checked={isVideo}
                  onChange={(e) => setIsVideo(e.target.checked)}
                  color="primary"
                />
              )}
              label="Is this a video?"
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}
              data-cy='create-post-button'
            >
              Create Post
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default CreatePost;
