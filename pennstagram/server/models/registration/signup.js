const { MongoClient } = require('mongodb');

async function signupModel(userData, callback) {
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

  // console.log('This is the user data:');
  // console.log(userData);
  try {
    const insertResult = await collection.insertOne(userData);
    if (insertResult === null) {
      // console.log('insert failed!');
    } else {
      // console.log(`insert done:\n${JSON.stringify(insertResult)}\n`);
      callback(null, userData);
    }
  } catch (err) {
    // console.error(`Something went wrong trying to insert one document: ${err}\n`);
    callback(err, null);
  }

  await client.close();
}

module.exports = signupModel;
