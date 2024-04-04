// frontend/api/toggleHide.js

import axios from 'axios';

// const baseUrl = 'http://localhost:8080';
const baseUrl = ''; // Replace with your backend URL

// Updated function to include username parameter
export const toggleHide = async (postId, hidden, username) => {
  try {
    // eslint-disable-next-line
    const response = await axios.patch(`${baseUrl}/toggleHide/${postId}`, { hide: hidden, username: username });
    return response.data;
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error toggling hide:', error);
    throw error;
  }
};

export default toggleHide;
