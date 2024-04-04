import axios from 'axios';

// const baseUrl = 'http://localhost:8080';
const baseUrl = '';

export const updateUserFollowing = async (username, targetUsername, updatedFollowing) => {
  // axios.defaults.headers.common['Authorization'] = localStorage.getItem('app-token');
  axios.defaults.headers.common.Authorization = localStorage.getItem('app-token');
  try {
    const response = await axios.patch(
      `${baseUrl}/updateFollowing/${username}/${targetUsername}`,
      { updatedFollowing },
    );
    return response.data;
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error updating user following:', error);
    throw error; // Rethrow the error for handling in the component
  }
};

export default updateUserFollowing; // Default export
