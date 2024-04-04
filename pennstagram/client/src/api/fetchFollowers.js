import axios from 'axios';

// const baseUrl = 'http://localhost:8080';
const baseUrl = ''; // Replace with your API base URL

export const fetchFollowerCount = async (username) => {
  try {
    const response = await axios.get(`${baseUrl}/user/${username}/followers`);
    return response.data;
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error fetching follower count:', error.message);
    throw error;
  }
};

export default fetchFollowerCount;
