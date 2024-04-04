// const { MongoClient } = require('mongodb');

// async function deleteUsersWithEmail() {
//   const uri = 'mongodb+srv://edgoze:w35WlJZe5tRhoimz@pennstagram.yygdpja.mongodb.net/?retryWrites=true&w=majority';

//   const client = new MongoClient(uri);

//   try {
//     await client.connect();

//     const database = client.db('pennstagram'); // Replace with your database name
//     const collection = database.collection('users'); // Replace with your collection name
//     // const collection = database.collection('posts'); // Replace with your collection name

//     // Define the condition to match users with the specified email
//     const condition = { email: 'test@example.com' };
//     // const condition = { poster: 'alice' };

//     // Delete all users that match the condition
//     const result = await collection.deleteMany(condition);

//     // eslint-disable-next-line
//     console.log(`${result.deletedCount} users deleted`);
//   } catch (error) {
//     // eslint-disable-next-line
//     console.error('Error deleting users:', error);
//   } finally {
//     await client.close();
//   }
// }

// // Call the function to delete users with the specified email
// deleteUsersWithEmail();

// const { MongoClient, ObjectId } = require('mongodb');

// async function addHiddenByField() {
//   const uri = 'mongodb+srv://edgoze:w35WlJZe5tRhoimz@pennstagram.yygdpja.mongodb.net/?retryWrites=true&w=majority';
//   const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     const dbName = 'pennstagram';
//     const collection = client.db(dbName).collection('posts');

//     // Find all posts without the "hiddenBy" field
//     const postsWithoutHiddenBy =
//     await collection.find({ hiddenBy: { $exists: false } }).toArray();

//     // Update each post by adding an empty "hiddenBy" field
//     const updatePromises = postsWithoutHiddenBy.map(async (post) => {
//       const result = await collection.updateOne(
//         { _id: new ObjectId(post._id) },
//         { $set: { hiddenBy: [] } }
//       );
//       return result.modifiedCount > 0;
//     });

//     // Wait for all updates to complete
//     const updateResults = await Promise.all(updatePromises);

//     console.log(`${updateResults.length} posts updated successfully.`);
//   } catch (err) {
//     console.error('An error occurred:', err);
//   } finally {
//     await client.close();
//   }
// }

// // Run the script
// addHiddenByField();
