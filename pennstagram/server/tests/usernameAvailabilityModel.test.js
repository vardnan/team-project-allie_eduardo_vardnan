const checkUsernameAvailability = require('../models/registration/usernameAvailability');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;
let client;
let db;

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

describe('Check Username Availability Model', () => {
  beforeEach(async () => {
    await db.collection('users').deleteMany({}); // Clean the database before each test
  });

  test('Check available username', async () => {
    const username = 'usernameAvailabilityTestUser'; // Specify a username that is not present in your test database

    // Call the checkUsernameAvailability function
    const isAvailable = await checkUsernameAvailability(username);

    // Assertions for available username
    expect(isAvailable).toBe(true);
  });

  test('Check unavailable username', async () => {
    const username = 'alice123'; // Specify a username that exists in your test database
    await db.collection('users').insertOne({ username }); // Insert the user to the database

    // Call the checkUsernameAvailability function
    const isAvailable = await checkUsernameAvailability(username);

    // Assertions for unavailable username
    expect(isAvailable).toBe(false);
  });
});
