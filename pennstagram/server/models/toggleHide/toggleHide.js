// models/toggleHide/toggleHide.js

const { MongoClient, ObjectId } = require('mongodb');

async function toggleHideModel(postId, username, hide) {
  // console.log('THIS IS THE MONGO URI ', process.env.MONGO_URI)
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const dbName = 'pennstagram';
    const collection = client.db(dbName).collection('posts');

    let updateOperation;

    if (hide) {
      updateOperation = { $addToSet: { hiddenBy: username } };
    } else {
      updateOperation = { $pull: { hiddenBy: username } };
    }

    const result = await collection.updateOne({ _id: new ObjectId(postId) }, updateOperation);

    if (result.modifiedCount > 0) {
      return { success: true };
    }

    return { success: false, message: 'Post not found or update failed' };
  } catch (err) {
    // eslint-disable-next-line
    console.error(`An error occurred during the ${hide ? 'hide' : 'unhide'} operation: ${err}`);
    throw err;
  } finally {
    await client.close();
  }
}

module.exports = toggleHideModel;
