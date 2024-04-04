const request = require('supertest');
const app = require('../app');
const mockedCreateCommentModel = require('../models/comment/comment');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod; // MongoDB Memory Server instance
let client; // MongoDB client

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = await mongod.getUri();
    client = new MongoClient(uri);
    await client.connect();
  });
  
  afterAll(async () => {
    await client.close();
    await mongod.stop();
  });


  describe('mockedCreateCommentModel', () => {
    test('creates a new post', async () => {
      // Define the test post data
      const postId = '653eb42c04b85697e3d1cd7d'
      const newCommentData = {
        username: "diana_p",
        comment: "Cool photo!",
        commenterProfileImage: "https://source.unsplash.com/mEZ3PoFGs_k"
      }
  
      // Define a mock callback function
      const mockCallback = jest.fn();
  
      // Call the mockedCreateCommentModel function
      await mockedCreateCommentModel(postId, newCommentData, mockCallback);
  
      // Replace 'collectionName' with the actual collection name from your code
      const collectionName = 'posts';
  
      // Fetch the inserted post from the database
      const insertedComment = await client
        .db('pennstagram')
        .collection(collectionName)
        .findOne({ poster: newCommentData.username });

    //   console.log('This is the inserted post:')
    //   console.log(insertedPost);
  
      // Assertions
      expect(mockCallback).toHaveBeenCalledTimes(1); // Ensure the callback is called
      expect(mockCallback).toHaveBeenCalledWith(expect.any(Object)); // Ensure the callback is called with an object
    //   expect(insertedPost).toMatchObject(postData); // Ensure the inserted post matches the test data
    });
  });
