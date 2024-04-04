const { MongoClient } = require('mongodb');
const handleLockout = require('./handleLockout');

async function loginModel(username, password, callback) {
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
    // Step 1: Find user by username only
    const user = await collection.findOne({ username });

    if (!user) {
      callback('User not found', null);
    } else {
      // Step 2: Initialize missing fields
      const currentTime = new Date();

      if (user.loginAttempts === undefined) user.loginAttempts = 0;
      if (user.lastLoginAttemptTime === undefined) user.lastLoginAttemptTime = null;
      if (user.lockUntil === undefined) user.lockUntil = null;

      // Step 3: Lockout logic
      const lockoutResult = await handleLockout(
        collection,
        user,
        password,
        currentTime,
      );

      if (lockoutResult.status !== 'success') {
        callback(lockoutResult.message, null);
        return;
      }

      // Step 4: If the function reaches this point, the login is successful
      callback(null, user);
    }
  } catch (err) {
    callback(err, null);
  } finally {
    await client.close();
  }
}

module.exports = loginModel;
