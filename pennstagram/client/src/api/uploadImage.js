import axios from 'axios';

// const baseUrl = 'http://localhost:8080';
const baseUrl = ''; // Replace with your API base URL

export const uploadFile = async (files) => {
  try {
    const res = await axios.post(`${baseUrl}/uploadImage`, files, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // console.log(`Upload sucessful ${res}`);
    return res;
  } catch (err) {
    // eslint-disable-next-line
    console.err(err.message);
    return err;
  }
};

export default uploadFile;
