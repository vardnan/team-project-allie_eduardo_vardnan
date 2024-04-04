const { MongoClient } = require('mongodb');

async function searchUserByUsername(username) {
  // console.log('THIS IS THE MONGO URI ', process.env.MONGO_URI)
  const uri = process.env.MONGO_URI;

  // The MongoClient is the object that references the connection to our
  // datastore (Atlas, for example)
  const client = new MongoClient(uri);

  // The connect() method does not attempt a connection; instead it instructs
  // the driver to connect using the settings provided when a connection
  // is required.
  await client.connect();

  const dbName = 'pennstagram';
  const collectionName = 'users';

  // Create references to the database and collection in order to run
  // operations on them.
  const database = client.db(dbName);
  const collection = database.collection(collectionName);

  try {
    const foundUser = await collection.findOne({ username });

    return foundUser;
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error searching for user:', error);
    throw error;
  } finally {
    await client.close();
  }
}

module.exports = searchUserByUsername;
