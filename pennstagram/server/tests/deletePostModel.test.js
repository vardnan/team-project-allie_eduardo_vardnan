const request = require('supertest');
const app = require('../app');
const newPostModel = require('../models/createPost/newPost');
const deletePostModel = require('../models/posts/deletePost');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod; // MongoDB Memory Server instance
let client; // MongoDB client

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

describe('deletePostModel', () => {
  test('deletes a post', async () => {
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

    // Define a mock callback function for newPostModel
    const newPostCallback = jest.fn();

    // Call the newPostModel function to create a test post
    await newPostModel(postData, newPostCallback);

    // Get the post ID from the callback result (you may need to adjust this based on your actual implementation)
    const postIdToDelete = newPostCallback.mock.calls[0][0].insertedId;

    // Ensure that the post has been successfully created
    expect(newPostCallback).toHaveBeenCalledTimes(1);
    expect(postIdToDelete).toBeDefined();

    // Define a mock callback function for deletePostModel
    const deletePostCallback = jest.fn();

    // Call the deletePostModel function to delete the post
    await deletePostModel(postIdToDelete, deletePostCallback);

    // Assertions
    expect(deletePostCallback).toHaveBeenCalledTimes(1); // Ensure the deletePostCallback is called
    expect(deletePostCallback.mock.calls[0][0].acknowledged).toBe(true); // Ensure successful deletion

    // You can also add further assertions to check if the post is deleted from the database
  });
});
