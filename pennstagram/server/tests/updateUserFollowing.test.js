const request = require('supertest');
process.env.NODE_ENV = 'test';
const app = require('../app');
jest.mock('../models/userFollowing/updateUserFollowing');
const mockedUpdateUserFollowing = require('../models/userFollowing/updateUserFollowing');

let server, agent;

beforeAll((done) => {
  server = app.listen(0, () => {
    // Get the address information of the server
    const address = server.address();
    const port = address.port;
    // Create a supertest agent using the assigned port
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

describe('Update user following', () => {
  test('Successfully updating user following', async () => {
    const username = 'zuckerberg';
    const updatedFollowing = 'elonmusk';

    mockedUpdateUserFollowing.mockImplementation(
      (username, updatedFollowing) => {
        const mockResult = {
          username: username,
          updatedFollowing: updatedFollowing,
        };

        return mockResult;
      }
    );

    // Make the request

    const response = await agent
      .patch(`/updateFollowing/${username}`)
      .send({ updatedFollowing: updatedFollowing });

    // Assertions
    expect(response.statusCode).toBe(201);
    expect(mockedUpdateUserFollowing).toHaveBeenCalledWith(
      username,
      updatedFollowing
    );
  }, 5000);

  test('Failed updating user following', async () => {
    const username = 'zuckerberg';
    const updatedFollowing = 'elonmusk';

    mockedUpdateUserFollowing.mockImplementation(
      (username, updatedFollowing) => {
        return Promise.reject(
          new Error('An error occurred while updating user following')
        );
      }
    );

    // Make the request

    const response = await agent
      .patch(`/updateFollowing/${username}`)
      .send({ updatedFollowing: updatedFollowing });

    // Assertions
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      error: 'An error occurred while updating user following',
    });
    expect(mockedUpdateUserFollowing).toHaveBeenCalledWith(
      username,
      updatedFollowing
    );
  }, 5000);
});
