import axios from 'axios';

// const baseUrl = 'http://localhost:8080';
const baseUrl = '';

export const updatePostImageUrl = async (postId, updatedImageUrl) => {
  // axios.defaults.headers.common['Authorization'] = localStorage.getItem('app-token');
  axios.defaults.headers.common.Authorization = localStorage.getItem('app-token');
  try {
    const response = await axios.patch(`${baseUrl}/updatePostImageUrl/${postId}`, {
      updatedImageUrl,
    });
    return response.data;
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error updating post image URL:', error);
    throw error;
  }
};

export default updatePostImageUrl;
