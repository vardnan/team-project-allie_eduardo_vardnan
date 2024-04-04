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

describe('Account lockout', () => {
  test('2 failedl login attempts ', async () => {
    const username = 'testUser';
    const password = 'testPassword';

    // Mock the loginModel function to simulate successful authentication
    mockedLoginModel.mockImplementation((username, password, callback) => {
      const fakeUserData = { username, password, loginAttempts: 2 };
      callback(
        'You have 2 failed login attempts. A third failed attempt will temporarily lock the account for 10 minutes for security purposes',
        null
      );
    });

    // Make the request to the authentication route
    const response = await request(app)
      .post('/login')
      .send({ username, password });

    // Assertions
    expect(response.status).toBe(400);
    expect(response.text).toContain(
      'You have 2 failed login attempts. A third failed attempt will temporarily lock the account for 10 minutes for security purposes'
    );
  });

  test('Lockout after 3 failed attempts', async () => {
    const username = 'testUser';
    const password = 'testPassword';

    // Mock the loginModel function to simulate successful authentication
    mockedLoginModel.mockImplementation((username, password, callback) => {
      const fakeUserData = { username, password, loginAttempts: 3 };
      callback(
        'You have 3 failed login attempts. The account is temporarily locked for 10 minutes for security purposes',
        null
      );
    });

    // Make the request to the authentication route
    const response = await request(app)
      .post('/login')
      .send({ username, password });

    // Assertions
    expect(response.status).toBe(400);
    expect(response.text).toContain(
      'You have 3 failed login attempts. The account is temporarily locked for 10 minutes for security purposes'
    );
  });

  test('Not able to temporarily login if locked out', async () => {
    const username = 'testUser';
    const password = 'testPassword';

    // Mock the loginModel function to simulate successful authentication
    mockedLoginModel.mockImplementation((username, password, callback) => {
      const fakeUserData = { username, password, lockedUntil: new Date() };
      callback(
        'Account is locked temporarily, try again in a few minutes',
        null
      );
    });

    // Make the request to the authentication route
    const response = await request(app)
      .post('/login')
      .send({ username, password });

    // Assertions
    expect(response.status).toBe(400);
    expect(response.text).toContain(
      'Account is locked temporarily, try again in a few minutes'
    );
  });
});
