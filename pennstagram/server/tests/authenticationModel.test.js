const loginModel = require('../models/authentication/login'); // Import the login model
const { MongoClient, ObjectId } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod; // MongoDB Memory Server instance
let client; // MongoDB client
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

describe('Login Model Tests', () => {
  it('should authenticate user with valid credentials', async () => {
    // Insert a mock user
    const mockUser = {
      _id: new ObjectId(),
      id: '123453',
      username: 'ivan123',
      password: 'correctPassword',
      profileImage: 'https://source.unsplash.com/3TLl_97HNJo',
      bio: 'Just another passionate photographer 📸. Exploring the world one click…',
      followers: [],
      following: [],
      lastLoginAttemptTime: null,
      lockUntil: null,
      loginAttempts: 0,
    };

    await db.collection('users').insertOne(mockUser);

    // Mock callback function
    const mockCallback = jest.fn();

    // Test the login model with valid credentials
    await loginModel('ivan123', 'correctPassword', mockCallback);

    // Assertions
    expect(mockCallback).toHaveBeenCalledTimes(1); // Ensure the callback is called
    expect(mockCallback).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ username: 'ivan123' })
    );
  });

  it('should not authenticate user with invalid credentials', async () => {
    // Insert a mock user
    const mockUser = {
      _id: new ObjectId(),
      id: '1234532',
      username: 'jacky123',
      password: 'correctPassword',
      profileImage: 'https://source.unsplash.com/3TLl_97HNJo',
      bio: 'Just another passionate photographer 📸. Exploring the world one click…',
      followers: [],
      following: [],
      lastLoginAttemptTime: null,
      lockUntil: null,
      loginAttempts: 0,
    };
    await db.collection('users').insertOne(mockUser);

    // Mock callback function
    const mockCallback = jest.fn();

    // Test the login model with invalid credentials
    await loginModel('jacky123', 'wrongPassword', mockCallback);

    // Assertions
    expect(mockCallback).toHaveBeenCalledWith(
      'Incorrect username or password',
      null
    );
  });

  it('should lock the account after 3 failed attempts', async () => {
    // Insert a mock user with 2 failed attempts already
    const mockUser = {
      _id: new ObjectId(),
      id: '12345321',
      username: 'rony123',
      password: 'correctPassword',
      profileImage: 'https://source.unsplash.com/3TLl_97HNJo',
      bio: 'Just another passionate photographer 📸. Exploring the world one click…',
      followers: [],
      following: [],
      lastLoginAttemptTime: null,
      lockUntil: null,
      loginAttempts: 2,
    };
    await db.collection('users').insertOne(mockUser);

    // Mock callback function
    const mockCallback = jest.fn();

    // Test the login model with a third failed attempt
    await loginModel('rony123', 'wrongPassword', mockCallback);

    // Assertions
    expect(mockCallback).toHaveBeenCalledWith(
      'You have 3 failed login attempts. The account is temporarily locked for 10 minutes for security purposes',
      null
    );
  });

  it('should not access locked account temporarily', async () => {
    // Insert a mock user with 2 failed attempts already
    const mockUser = {
      _id: new ObjectId(),
      id: '123453212',
      username: 'roland123',
      password: 'correctPassword',
      profileImage: 'https://source.unsplash.com/3TLl_97HNJo',
      bio: 'Just another passionate photographer 📸. Exploring the world one click…',
      followers: [],
      following: [],
      lastLoginAttemptTime: new Date(new Date().getTime() + 1 * 60000),
      lockUntil: new Date(new Date().getTime() + 15 * 60000),
      loginAttempts: 3,
    };
    await db.collection('users').insertOne(mockUser);

    // Mock callback function
    const mockCallback = jest.fn();

    // Test the login model with a third failed attempt
    await loginModel('roland123', 'correctPassword', mockCallback);

    // Assertions
    expect(mockCallback).toHaveBeenCalledWith(
      'Account is locked temporarily, try again in a few minutes',
      null
    );
  });
});
