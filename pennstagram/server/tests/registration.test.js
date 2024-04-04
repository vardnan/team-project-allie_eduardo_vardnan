const request = require('supertest');
const app = require('../app');

jest.mock('../models/registration/signup');
const mockedSignupModel = require('../models/registration/signup');

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

describe('Registration Route', () => {
  test('Successful user registration', async () => {
    const userData = {
      username: 'testUser',
      email: 'test@example.com',
      password: 'testPassword',
    };

    mockedSignupModel.mockImplementation((userData, callback) => {
      const dataToReturn = { ...userData };
      delete dataToReturn.password; // Assume the password is not returned
      callback(null, dataToReturn);
    });

    const expectedResponseData = {
      userInfo: {
        username: userData.username,
        email: userData.email,
        // Include any other fields that the userInfo object should have
      },
      apptoken: expect.any(String),
    };

    const response = await agent.post('/signup').send(userData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponseData);
    expect(mockedSignupModel).toHaveBeenCalledWith(
      expect.objectContaining({
        username: userData.username,
        email: userData.email,
        password: userData.password,
      }),
      expect.any(Function)
    );
  });

  test('Failed user registration', async () => {
    const incompleteUserData = {
      email: 'test@example.com',
      password: 'testPassword',
      // Omitting username or other required data
    };

    mockedSignupModel.mockImplementation((incompleteUserData, callback) => {
      callback(new Error('Error: Incomplete user data'), null);
    });

    const response = await agent.post('/signup').send(incompleteUserData);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      'Signup failed. Please try again later.'
    );
    expect(mockedSignupModel).toHaveBeenCalledWith(
      expect.objectContaining({
        email: incompleteUserData.email,
        password: incompleteUserData.password,
      }),
      expect.any(Function)
    );
  });
});
