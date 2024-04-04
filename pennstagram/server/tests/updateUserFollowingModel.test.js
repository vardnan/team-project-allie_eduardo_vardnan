// updateUserFollowingModel.test.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient, ObjectId } = require('mongodb');
const updateUserFollowing = require('../models/userFollowing/updateUserFollowing');

describe('updateUserFollowingModel Integration Tests', () => {
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

  beforeEach(async () => {
    await db.collection('users').deleteMany({});
  });

  test('should update user following list', async () => {
    const user = {
      _id: new ObjectId(),
      id: '12345',
      username: 'alice123',
      following: ['bob_smith'],
      password: 'password123',
      profileImage: 'https://source.unsplash.com/3TLl_97HNJo',
      bio: 'Just another passionate photographer 📸. Exploring the world one click…',
      followers: [],
    };

    // Insert the user data into the database
    const insertUser = await db.collection('users').insertOne(user);

    const updatedFollowing = ['bob_smith', 'charlie_b'];

    // Call the updateUserFollowing function
    const result = await updateUserFollowing(user.username, updatedFollowing);

    const updatedUser = await db
      .collection('users')
      .findOne({ username: user.username });

    // Assertions
    expect(updatedUser).toBeTruthy();
    expect(updatedUser.following).toEqual(updatedFollowing);
    expect(result.success).toBe(true);
    expect(result.message).toBe('User following updated successfully');
  });

  test('should not update non-existent user', async () => {
    const result = await updateUserFollowing('nonexistentuser', [
      'new_following',
    ]);
    expect(result.success).toBe(false);
    expect(result.message).toBe('No user found with the given username');
  });

  test('should update user following list with empty array', async () => {
    const user = {
      _id: new ObjectId(),
      id: '12345',
      username: 'alice123',
      following: ['bob_smith'],
      password: 'password123',
      profileImage: 'https://source.unsplash.com/3TLl_97HNJo',
      bio: 'Just another passionate photographer 📸. Exploring the world one click…',
      followers: [],
    };
    await db.collection('users').insertOne(user);

    const updatedFollowing = [];
    const result = await updateUserFollowing(user.username, updatedFollowing);
    const updatedUser = await db
      .collection('users')
      .findOne({ username: user.username });

    expect(updatedUser.following).toEqual(updatedFollowing);
    expect(result.success).toBe(true);
    expect(result.message).toBe('User following updated successfully');
  });
});
