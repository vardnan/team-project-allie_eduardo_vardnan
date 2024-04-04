const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const searchUserModel = require('../models/searchUser/searchUser');

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

describe('Search User Model', () => {
  test('Search for an existing user', async () => {
    const username = 'alice123';

    // Search for the user using your model's function
    const foundUser = await searchUserModel(username);

    // Assertions
    expect(foundUser).not.toBeNull();
    if (foundUser) {
      expect(foundUser.username).toBe(username);
    }
  });

  test('Search for a non-existing user', async () => {
    const username = 'nonExistingUser';

    // Search for the user using your model's function
    const foundUser = await searchUserModel(username);

    // Assertions
    expect(foundUser).toBeNull();
  });
});
