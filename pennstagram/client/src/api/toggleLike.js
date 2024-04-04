import axios from 'axios';

// const baseUrl = 'http://localhost:8080';
const baseUrl = ''; // Replace with your backend URL

// removed currUsername from params and body
export const toggleLike = async (postId, currUsername, like) => {
  // axios.defaults.headers.common['Authorization'] = localStorage.getItem('app-token');
  axios.defaults.headers.common.Authorization = localStorage.getItem('app-token');
  try {
    const response = await axios.patch(`${baseUrl}/toggleLike/${postId}`, {
      currUsername,
      like,
    });
    return response.data;
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error toggling like:', error);
    throw error;
  }
};

export default toggleLike;
