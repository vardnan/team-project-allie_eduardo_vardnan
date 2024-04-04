const { MongoClient, ObjectId } = require('mongodb');

async function deletePostModel(postId, callback) {
  // console.log('THIS IS THE MONGO URI ', process.env.MONGO_URI)
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const dbName = 'pennstagram';
    const collection = client.db(dbName).collection('posts');

    const result = await collection.deleteOne({ _id: new ObjectId(postId) });

    if (result.deletedCount > 0) {
      // console.log('Post deleted successfully with ID:', postId);
      callback(result);
    } else {
      // console.log('Failed to delete the post.');
    }
  } catch (err) {
    // console.error('An error occurred during deletion:', err);
  } finally {
    await client.close();
  }
}

module.exports = deletePostModel;
