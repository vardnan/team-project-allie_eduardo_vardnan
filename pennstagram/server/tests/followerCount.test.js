const fetchFollowerCount = require('../models/getFollowers/followerCount');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod; // MongoDB Memory Server instance
let client; // MongoDB client
let db; // Database instance

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

beforeEach(async () => {
  await db.collection('users').deleteMany({}); // Clean the database before each test
});

describe('fetchFollowerCount Model', () => {
  test('returns the correct follower count for a user with followers', async () => {
    const username = 'alice';
    const followers = ['bob', 'carol', 'dave'];

    await db.collection('users').insertOne({
      username,
      followers,
    });

    const followerCount = await fetchFollowerCount(username);

    expect(followerCount).toBe(followers.length);
  });

  test('returns 0 for a user with no followers', async () => {
    const username = 'alice';

    await db.collection('users').insertOne({
      username,
      followers: [],
    });

    const followerCount = await fetchFollowerCount(username);

    expect(followerCount).toBe(0);
  });

  test('returns 0 for a user that does not exist', async () => {
    const nonExistentUser = 'nonexistentuser';
    const followerCount = await fetchFollowerCount(nonExistentUser);

    expect(followerCount).toBe(0);
  });
});
