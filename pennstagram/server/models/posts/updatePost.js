const { MongoClient, ObjectId } = require('mongodb');

async function updatePostModel(postId, updateData) {
  // console.log('THIS IS THE MONGO URI ', process.env.MONGO_URI)
  const uri = process.env.MONGO_URI;

  const client = new MongoClient(uri);
  await client.connect();

  try {
    const dbName = 'pennstagram';
    const collection = client.db(dbName).collection('posts');

    const updateQuery = { $set: {} };
    // eslint-disable-next-line
    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        updateQuery.$set[key] = value;
      }
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(postId) },
      updateQuery,
    );

    return result; // Return the result for further processing
  } catch (err) {
    // eslint-disable-next-line
    console.error(`An error occurred during the updating operation: ${err}`);
    throw err; // Rethrow the error to handle it in the calling function
  } finally {
    await client.close();
  }
}

module.exports = updatePostModel;
