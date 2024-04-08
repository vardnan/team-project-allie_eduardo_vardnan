const { MongoClient, ObjectId } = require('mongodb');

async function setHiddenStatus(postId) {
  const uri = process.env.REACT_APP_MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const dbName = 'pennstagram';
    const collection = client.db(dbName).collection('posts');

    const result = await collection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: { hidden: false } },
    );

    if (result.modifiedCount > 0) {
      // eslint-disable-next-line
      console.log(`Successfully updated the hidden status for the post: ${postId}`);
    } else {
      // eslint-disable-next-line
      console.log('Failed to update the hidden status.');
    }
  } catch (err) {
    // eslint-disable-next-line
    console.error(`An error occurred during the update operation: ${err}`);
  } finally {
    await client.close();
  }
}

// Replace '<YOUR_POST_ID>' with the actual _id value
const postIdToUpdate = '653eb32204b85697e3d1cd6e';

// Call the function with the postId to update the hidden field
setHiddenStatus(postIdToUpdate);
