const { MongoClient } = require('mongodb');

async function checkUsernameAvailability(username) {
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
    const user = await collection.findOne({ username });

    await client.close();

    return !user; // Returns true if the username is available, i.e., not found in the database
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error checking username availability:', error);
    throw error;
  }
}

module.exports = checkUsernameAvailability;
