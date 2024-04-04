// updateUserFollowing.js

const { MongoClient } = require('mongodb');

async function updateUserFollowing(username, targetUsername, updatedFollowing) {
  // console.log('THIS IS THE MONGO URI ', process.env.MONGO_URI)
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  await client.connect();

  const dbName = 'pennstagram';
  const collectionName = 'users';

  const database = client.db(dbName);
  const collection = database.collection(collectionName);

  try {
    const filter = { username };
    const updateDoc = {
      $set: {
        following: updatedFollowing,
      },
    };

    const result = await collection.updateOne(filter, updateDoc);

    // Check if username already exists in the "followers" set of targetUsername
    const targetUser = await collection.findOne({ username: targetUsername });
    const isAlreadyFollowing = targetUser.followers.includes(username);

    // Update the 'followers' field of the target user based on the condition
    const updateFollowedDoc = isAlreadyFollowing
      ? { $pull: { followers: username } } // Remove username from "followers"
      : { $addToSet: { followers: username } }; // Add username to "followers"

    // Assuming the user being followed is identified by the username
    await collection.updateOne({ username: targetUsername }, updateFollowedDoc);

    if (result.matchedCount === 0) {
      // eslint-disable-next-line
      console.log(`No user found with username: ${username}`);
      return {
        success: false,
        message: 'No user found with the given username',
      };
    }

    if (result.modifiedCount === 0) {
      // eslint-disable-next-line
      console.log(`User following already contains the values: ${updatedFollowing}`,);
      return { success: false, message: 'User following not updated' };
    }

    // console.log(`User following updated successfully for username: ${username}`,);
    return { success: true, message: 'User following updated successfully' };
  } catch (error) {
    // eslint-disable-next-line
    console.error(`Error updating user following for username: ${username}`,error,);
    throw error;
  } finally {
    await client.close();
  }
}

module.exports = updateUserFollowing;
