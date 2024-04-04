const { MongoClient, ObjectId } = require('mongodb');

async function toggleLikeModel(postId, currUsername, like) {
  // console.log('THIS IS THE MONGO URI ', process.env.MONGO_URI)
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const dbName = 'pennstagram';
    const collection = client.db(dbName).collection('posts');

    let updateOperation = {};

    const { username } = currUsername; // Extracting the username

    if (like) {
      updateOperation = { $addToSet: { likes: username } };
    } else {
      updateOperation = { $pull: { likes: username } };
    }
    // console.log(postId);
    const result = await collection.updateOne({ _id: new ObjectId(postId) }, updateOperation);

    if (result.modifiedCount > 0) {
      // console.log(`Successfully ${like ? 'like' : 'unlike'}d the post:`, postId);
      // callback(result);
    } else {
      // console.log(`Failed to ${like ? 'like' : 'unlike'} the post.`);
    }
  } catch (err) {
    // console.error(`An error occurred during the ${like ? 'like' : 'unlike'} operation: ${err}`);
  } finally {
    await client.close();
  }
}

module.exports = toggleLikeModel;
