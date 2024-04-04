const { MongoClient } = require('mongodb');

// Adding default values to page and limit because in the client, the HiddenPosts.js
// file uses this model but provides no page nor limit. This caused no posts to
// be sent at all since the values for page and limit were undefined, which
// caused an error in this file.
// eslint-disable-next-line
async function followingPosts(usernames, currUserUsername, page = 1, limit = 100, callback) {
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
  const collectionName = 'posts';
  // Create references to the database and collection in order to run
  // operations on them.
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const findQuery = {
    $or: [
      { poster: { $in: usernames } }, // Matches any username in the usernames array
      { poster: currUserUsername }, // Matches the currUsername variable
    ],
  };

  const skip = (page - 1) * limit;

  try {
    const followingPostsResult = await collection
      .find(findQuery)
      .sort({ timeOfPost: -1 }) // Sort by createdAt in descending order
      .skip(skip)
      .limit(limit)
      .toArray();

    callback(null, followingPostsResult); // Pass results to the callback with null as the error
  } catch (err) {
    callback(err, null); // Pass error to the callback
  } finally {
    await client.close();
  }
}

module.exports = followingPosts;
