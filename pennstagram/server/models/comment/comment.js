const { MongoClient, ObjectId } = require('mongodb');

async function newCommentModel(postId, newCommentData, callback) {
  // console.log('THIS IS THE MONGO URI ', process.env.MONGO_URI)
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const dbName = 'pennstagram';
    const collection = client.db(dbName).collection('posts');

    const result = await collection.updateOne(
      { _id: new ObjectId(postId) },
      { $push: { comments: newCommentData } },
    );

    if (result.modifiedCount > 0) {
      // console.log('Successfully commented on the post:', postId);
      callback(result);
    } else {
      // console.log('Failed to comment on the post.');
    }
  } catch (err) {
    // console.error(`An error occurred during the comment operation: ${err}`);
  } finally {
    await client.close();
  }
}

module.exports = newCommentModel;
