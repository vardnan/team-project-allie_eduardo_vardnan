const request = require('supertest');
const app = require('../app');
const newPostModel = require('../models/createPost/newPost');
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

afterEach(async () => {
  if (client) {
    await client.close();
  }
});

afterAll(async () => {
  if (mongod) {
    await mongod.stop();
  }
});

describe('newPostModel', () => {
  test('creates a new post', async () => {
    // Define the test post data
    const postData = {
      ido: '12345',
      poster: 'alicedgg',
      imageUrl: 'https://source.unsplash.com/nKC772R_qog',
      caption: 'cat!!',
      timeOfPost: 'now',
      comments: [],
      likes: [],
      isVideo: false,
      posterProfileImage: 'https://source.unsplash.com/nKC772R_qog',
    };

    // Define a mock callback function
    const mockCallback = jest.fn();

    // Call the newPostModel function
    await newPostModel(postData, mockCallback);

    // Replace 'collectionName' with the actual collection name from your code
    const collectionName = 'posts';

    // Fetch the inserted post from the database
    const insertedPost = await client
      .db('pennstagram')
      .collection(collectionName)
      .findOne({ poster: postData.poster });

    //   console.log('This is the inserted post:')
    //   console.log(insertedPost);

    // Assertions
    expect(mockCallback).toHaveBeenCalledTimes(1); // Ensure the callback is called
    expect(mockCallback).toHaveBeenCalledWith(expect.any(Object)); // Ensure the callback is called with an object
    //   expect(insertedPost).toMatchObject(postData); // Ensure the inserted post matches the test data
  });
});
