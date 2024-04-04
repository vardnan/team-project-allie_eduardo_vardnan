import axios from 'axios';

// const baseUrl = 'http://localhost:8080';
const baseUrl = ''; // Replace with your API base URL

export const checkUsernameAvailability = async (username) => {
  try {
    const response = await axios.get(`${baseUrl}/checkAvailability?username=${username}`);
    // return response.data.length === 0; // Returns true if username is available
    return response.data.isAvailable;
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error checking username availability:', error);
    throw error; // Rethrow the error for handling in the component
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${baseUrl}/signup`, userData);
    // eslint-disable-next-line
    const data = response.data;
    const token = data.apptoken;
    const user = data.userInfo;
    if (token) {
      // eslint-disable-next-line
      localStorage.setItem('app-token', token);
      localStorage.setItem('username', user.username);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('viewingUser', JSON.stringify(user));
    }
    return data; // Assuming the API returns the newly registered user
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error registering user:', error);
    throw error; // Rethrow the error for handling in the component
  }
};
