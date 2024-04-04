import axios from 'axios';

// const baseUrl = 'http://localhost:8080';
const baseUrl = ''; // Replace with your API base URL

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(
      `${baseUrl}/login`,
      { username, password },
    );
    // const user = response.data;
    // eslint-disable-next-line
    const data = response.data;
    const token = data.apptoken;
    const user = data.userInfo;
    if (token) {
      localStorage.setItem('app-token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('viewingUser', JSON.stringify(user));
    }

    if (user) {
      return user;
    }
    throw new Error('Invalid username or password');
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data);
    } else {
      throw new Error('Unexpected error');
    }
  }
};

export default loginUser; // Default export
