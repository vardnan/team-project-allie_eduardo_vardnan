import axios from 'axios';

// const baseUrl = 'http://localhost:8080';
const baseUrl = '';

export const updatePostCaption = async (postId, updatedCaption) => {
  // axios.defaults.headers.common['Authorization'] = localStorage.getItem('app-token');
  axios.defaults.headers.common.Authorization = localStorage.getItem('app-token');
  try {
    const response = await axios.patch(`${baseUrl}/imageCaption/${postId}`, {
      updatedCaption,
    });
    return response.data;
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error updating post image URL:', error);
    throw error;
  }
};

export default updatePostCaption;
