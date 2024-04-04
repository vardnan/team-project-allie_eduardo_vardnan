// updatePostModel.test.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient, ObjectId } = require('mongodb');
const updatePostModel = require('../models/posts/updatePost');

describe('updatePostModel Integration Tests', () => {
  let mongod;
  let client;
  let db;

  // Start MongoDB Memory Server and establish a connection
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    process.env.MONGO_URI = uri; // Set the MONGO_URI to the in-memory server
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('pennstagram');
  });

  afterAll(async () => {
    await client.close();
    await mongod.stop();
    delete process.env.MONGO_URI; // Unset the MONGO_URI after the tests
  });

  // Clear the database before each test
  beforeEach(async () => {
    await db.collection('posts').deleteMany({});
  });

  test('should update a post caption', async () => {
    // Insert a mock post
    const post = {
      _id: new ObjectId(),
      id: 'post001',
      poster: 'alice123',
      imageUrl: 'https://source.unsplash.com/lIzq15ICeJk',
      caption: 'Jelly fish!!',
      comments: [],
      likes: [],
      isVideo: false,
      timeOfPost: '5 hours ago',
      posterProfileImage: 'https://source.unsplash.com/3TL_97HNJo',
    };

    const insertResult = await db.collection('posts').insertOne(post);

    // Define the update data
    const updateData = {
      caption: 'Updated Caption',
    };

    // Log the state of the document before the update
    const postBeforeUpdate = await db
      .collection('posts')
      .findOne({ _id: post._id });

    // Call the updatePostModel function
    await updatePostModel(post._id.toString(), updateData, async (result) => {
      // Check if the update was acknowledged and one document was modified
      expect(result.acknowledged).toBe(true);
      expect(result.modifiedCount).toBe(1);

      // Fetch the updated document from the database
      const updatedPost = await db
        .collection('posts')
        .findOne({ _id: post._id });
      console.log('Updated Post:', updatedPost);

      // Assertions to check if the caption was updated
      expect(updatedPost).toBeTruthy();
      expect(updatedPost.caption).toBe(updateData.caption);
    });
  });

  test('update with no changes should not modify document', async () => {
    // Insert a mock post
    const post = {
      _id: new ObjectId(),
      id: 'post001',
      poster: 'alice123',
      imageUrl: 'https://source.unsplash.com/lIzq15ICeJk',
      caption: 'Jelly fish!!', // Same caption as updateData
      comments: [],
      likes: [],
      isVideo: false,
      timeOfPost: '5 hours ago',
      posterProfileImage: 'https://source.unsplash.com/3TL_97HNJo',
    };
    await db.collection('posts').insertOne(post);

    // Define updateData with the same caption
    const updateData = { caption: 'Jelly fish!!' };

    // Call the updatePostModel function
    const result = await updatePostModel(post._id.toString(), updateData);

    // Fetch the updated document from the database
    const updatedPost = await db.collection('posts').findOne({ _id: post._id });

    // Check the result
    expect(updatedPost.caption).toBe(post.caption); // The caption should remain unchanged
    expect(result.modifiedCount).toBe(0);
  });
});
