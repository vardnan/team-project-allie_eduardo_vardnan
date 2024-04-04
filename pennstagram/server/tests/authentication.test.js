const request = require('supertest');
const app = require('../app');
jest.mock('../models/authentication/login');
const mockedLoginModel = require('../models/authentication/login');

let server, agent;

beforeAll((done) => {
  server = app.listen(0, () => {
    const address = server.address();
    const port = address.port;
    agent = request(`http://localhost:${port}`);
    done();
  });
});

afterAll((done) => {
  if (server && server.listening) {
    server.close(done);
  } else {
    done();
  }
});

describe('Authentication Route', () => {
  test('Successful authentication with valid credentials', async () => {
    const username = 'testUser';
    const password = 'testPassword';

    // Mock the loginModel function to simulate successful authentication
    mockedLoginModel.mockImplementation((username, password, callback) => {
      const fakeUserData = { username, email: 'test@example.com' };
      callback(null, fakeUserData);
    });

    // Make the request to the authentication route
    const response = await agent.post('/login').send({ username, password });

    // Assertions
    expect(response.status).toBe(200); // Check for a successful authentication status
    expect(response.body.userInfo.username).toBe(username); // Validate the response contains the username in userInfo
    expect(mockedLoginModel).toHaveBeenCalledWith(
      username,
      password,
      expect.any(Function)
    ); // Ensure loginModel was called
  });

  test('Failed authentication with invalid credentials', async () => {
    const username = 'nonExistentUser';
    const password = 'incorrectPassword';

    // Mock the loginModel function to simulate failed authentication
    mockedLoginModel.mockImplementation((username, password, callback) => {
      callback('Invalid credentials', null);
    });

    // Make the request to the authentication route
    const response = await agent.post('/login').send({ username, password });

    // Assertions for a failed authentication attempt
    expect(response.status).toBe(400); // Check for an unauthorized attempt status
  });
});
