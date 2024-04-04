import axios from 'axios';

// const baseUrl = 'http://localhost:8080';
const baseUrl = ''; // Replace with your API base URL

export const deletePost = async (postId) => {
  // axios.defaults.headers.common['Authorization'] = localStorage.getItem('app-token');
  axios.defaults.headers.common.Authorization = localStorage.getItem('app-token');
  try {
    const response = await axios.delete(`${baseUrl}/removePost/${postId}`);
    return response.data;
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error deleting the post:', error);
    throw error; // Rethrow the error for handling in the component
  }
};

export default deletePost; // Default export
