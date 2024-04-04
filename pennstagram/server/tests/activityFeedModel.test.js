const request = require('supertest');
const app = require('../app');
const mockedActivityModel = require('../models/activityFeed/posts');
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

describe('mockedActivityModel', () => {
  test('test model of fetching activty feed', async () => {
    const currUserUsername = 'alice123';
    const usernames = [];

    // Define a mock callback function
    const mockCallback = jest.fn();

    // Call the mockedActivityModel function
    await mockedActivityModel(usernames, currUserUsername, mockCallback);

    // Assertions
    expect(mockCallback).toHaveBeenCalledTimes(1); // Ensure the callback is called
    expect(mockCallback).toHaveBeenCalledWith(expect.any(Object)); // Ensure the callback is called with an object
    //   expect(insertedPost).toMatchObject(postData); // Ensure the inserted post matches the test data
  });
});
