const {
  Upload,
} = require('@aws-sdk/lib-storage');

const {
  S3,
} = require('@aws-sdk/client-s3');

// dotenv helps manage environment variables
require('dotenv').config();

// The name of the bucket that you have created
const BUCKET_NAME = 'cis557group10';

// we load credentials from the .env file
const s3 = new S3({
  credentials: {
    accessKeyId: process.env.ID,
    secretAccessKey: process.env.SECRET,
  },
  region: 'us-east-1',
});

// upload a file
const uploadFile = async (fileContent, fileName, isVideo) => {
  // eslint-disable-next-line
  // console.log('fileName', fileName);
  // Setting up S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName, // File name we want to upload
    Body: fileContent, // the buffer
    ContentType: isVideo ? 'video/quicktime' : undefined,
  };

  // Uploading files to the bucket

  const data = await new Upload({
    client: s3,
    params,
  }).done();
  // eslint-disable-next-line
  console.log(`File uploaded successfully. ${data.Location}`);
  // return the URL of the object on S3
  return data.Location;
};

module.exports = { uploadFile };
