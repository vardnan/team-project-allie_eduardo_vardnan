import axios from 'axios';

// const baseUrl = 'http://localhost:8080';
const baseUrl = ''; // Replace with your API base URL

export const createPost = async (postData) => {
  // axios.defaults.headers.common['Authorization'] = localStorage.getItem('app-token');
  axios.defaults.headers.common.Authorization = localStorage.getItem('app-token');
  try {
    const response = await axios.post(`${baseUrl}/posts`, postData);
    return response.data;
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error creating the post:', error);
    throw error; // Rethrow the error for handling in the component
  }
};

export default createPost; // Default export
