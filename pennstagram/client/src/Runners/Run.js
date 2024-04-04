const axios = require('axios');

const postData = { id: 7, title: 'json-server7', author: 'typicode7' };

const config = {
  headers: {
    'Content-Type': 'application/json', // Set the Content-Type header to application/json
  },
};

// Use port 5000 so that React can run in 3000
axios.post('http://localhost:5000/posts', postData, config)
  .then((response) => {
    // eslint-disable-next-line
    console.log('New post created:', response.data);
  })
  .catch((error) => {
    // eslint-disable-next-line
    console.error('Error creating post:', error);
  });
