const { MongoClient } = require('mongodb');

async function fetchFollowerCount(username) {
  // console.log('THIS IS THE MONGO URI ', process.env.MONGO_URI)
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const dbName = 'pennstagram';
    const collectionName = 'users';

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const user = await collection.findOne({ username });

    if (!user) {
      return 0; // User not found, return 0 followers
    }

    return user.followers.length;
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error fetching follower count:', error.message);
    throw error;
  } finally {
    await client.close();
  }
}

module.exports = fetchFollowerCount;
