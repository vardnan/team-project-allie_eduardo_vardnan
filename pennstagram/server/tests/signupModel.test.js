const request = require('supertest');
const app = require('../app');
const signupModel = require('../models/registration/signup'); // Import the signup model
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

describe('Signup Model Tests', () => {
  it('should create a user with valid data', (done) => {
    const userData = {
      username: 'testUser',
      email: 'test@example.com',
      password: 'testPassword'
      // Add other necessary user data for signup
    };

    // Execute the signup model with the provided user data
    signupModel(userData, (err, result) => {
      expect(err).toBeNull(); // Ensure no error
      expect(result).toEqual(userData); // Validate the result matches the provided user data
      done(); // Done callback to mark the test completion
    });
  });

  it('should fail to create a user with incomplete data', (done) => {
    const incompleteUserData = {
      // Missing or incomplete user data that might result in a failed signup
      email: 'test@example.com',
      password: 'testPassword'
      // Omitting username or other required data
    };

    // Execute the signup model with incomplete user data
    signupModel(incompleteUserData, (err, result) => {
      expect(err).toBeDefined(); // Ensure an error is returned
      expect(result).toBeNull(); // Validate that the result is null for a failed signup
      done(); // Done callback to mark the test completion
    });
  });
});


