import axios from 'axios';

// const baseUrl = 'http://localhost:8080';
const baseUrl = ''; // Replace with your API base URL

export const searchUserByUsername = async (username) => {
  // axios.defaults.headers.common['Authorization'] = localStorage.getItem('app-token');
  axios.defaults.headers.common.Authorization = localStorage.getItem('app-token');
  try {
    const response = await axios.get(`${baseUrl}/searchUser?username=${username}`);
    const foundUser = response.data;
    return foundUser;
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error searching for user:', error);
    throw error; // Rethrow the error for handling in the component
  }
};

export default searchUserByUsername; // Default export
