const { MongoClient } = require('mongodb');

async function followingPosts(currUserUsername, callback) {
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

  const findQuery = { poster: currUserUsername };

  try {
    const followingPostsResult = await collection.find(findQuery).toArray();
    if (followingPostsResult === null) {
      // console.log("Couldn't find any recipes that contain 'potato' as an ingredient.\n",);
    } else {
      //   console.log(`Found a recipe with 'potato' as an
      // ingredient:\n${JSON.stringify(followingPosts)}\n`);
      callback(followingPostsResult);
    }
  } catch (err) {
    // console.error(`Something went wrong trying to find one document: ${err}\n`);
  }

  await client.close();
}

module.exports = followingPosts;
