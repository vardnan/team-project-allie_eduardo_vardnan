import axios from 'axios';

// const baseUrl = 'http://localhost:8080';
const baseUrl = ''; // Replace with your API base URL

const fetchFeedPosts = async (followingUsernames, username, page, limit) => {
  // axios.defaults.headers.common['Authorization'] = localStorage.getItem('app-token');
  axios.defaults.headers.common.Authorization = localStorage.getItem('app-token');
  try {
    const response = await axios.post(`${baseUrl}/activityFeedPosts`, {
      usernames: followingUsernames,
      currUserUsername: username,
      page,
      limit,
    });
    const activityFeedPosts = response.data;
    return activityFeedPosts;
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error fetching activityFeedPosts:', error);
    throw error; // Rethrow the error for handling in the component
  }
};

export default fetchFeedPosts; // Default export
