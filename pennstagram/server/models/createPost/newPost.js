const { MongoClient } = require('mongodb');

async function newPostModel(postData, callback) {
  // console.log('THIS IS THE MONGO URI ', process.env.MONGO_URI)
  const uri = process.env.MONGO_URI;

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const dbName = 'pennstagram';
    const collection = client.db(dbName).collection('posts');

    // console.log('Attempting to insert the following post data:', postData);
    const result = await collection.insertOne(postData);
    // console.log('Result of the insert operation:', result);

    if (result.acknowledged) {
      // console.log('Post created successfully with ID:', result.insertedId);
      callback(result);
    } else {
      // console.log('Failed to create the post.');
    }
  } catch (err) {
    // console.error(`An error occurred during post creation: ${err}`);
  } finally {
    await client.close();
  }
}

module.exports = newPostModel;
