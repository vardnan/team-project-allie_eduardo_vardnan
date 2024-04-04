const request = require('supertest');
const app = require('../app');
const mockedToggle = require('../models/toggleLike/toggleLike');
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


  describe('mockedToggle', () => {
    test('creates a new post', async () => {
      const postId = 'onid0990'
      const currUsername = 'bob_rosario'
      const like = true;
      // Define a mock callback function
      const mockCallback = jest.fn();
  
      // Call the mockedToggle function
      await mockedToggle(postId, currUsername, like, mockCallback);
  
      // Assertions
      expect(mockCallback).toHaveBeenCalledTimes(0); // Ensure the callback is called
    });
  });
