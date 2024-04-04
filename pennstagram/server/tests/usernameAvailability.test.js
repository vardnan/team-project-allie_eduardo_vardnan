const request = require('supertest');
const app = require('../app');
const checkUsernameAvailability = require('../models/registration/usernameAvailability');

jest.mock('../models/registration/usernameAvailability');
const mockedCheckUsernameAvailability = require('../models/registration/usernameAvailability');

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

describe('Username Availability Route', () => {
  test('Successful username availability check', async () => {
    const username = 'availableUser';

    // Mock the checkUsernameAvailability function to simulate successful username availability
    mockedCheckUsernameAvailability.mockImplementation((username) => {
      return true; // Simulating that the username is available
    });

    // Make the request to check the username availability
    const response = await agent
      .get('/checkAvailability')
      .query({ username });

    // Assertions for a successful check
    expect(response.status).toBe(200); // Ensure status code for successful check
    expect(response.body.isAvailable).toBe(true); // Ensure username is available
    expect(mockedCheckUsernameAvailability).toHaveBeenCalledWith(username); // Ensure checkUsernameAvailability was called
  });

  test('Failed username availability check', async () => {
    const unavailableUsername = 'takenUser';

    // Mock the checkUsernameAvailability function to simulate a taken username
    mockedCheckUsernameAvailability.mockImplementation((unavailableUsername) => {
      return false; // Simulating that the username is already taken
    });

    // Make the request to check the username availability
    const response = await agent
      .get('/checkAvailability')
      .query({ username: unavailableUsername });

    // Assertions for a failed check
    expect(response.status).toBe(200); // Ensure status code for failed check (as 200 is expected even for a failed check)
    expect(response.body.isAvailable).toBe(false); // Ensure username is not available
    expect(mockedCheckUsernameAvailability).toHaveBeenCalledWith(unavailableUsername); // Ensure checkUsernameAvailability was called
  });

  test('Error in username availability check', async () => {
    const username = 'errorUser';

    // Mock the checkUsernameAvailability function to simulate an error in username availability check
    mockedCheckUsernameAvailability.mockImplementation((username) => {
      throw new Error('Error: Unable to check username availability');
    });

    // Make the request to check the username availability
    const response = await agent
      .get('/checkAvailability')
      .query({ username });

    // Assertions for an error in check
    expect(response.status).toBe(500); // Ensure status code for error in check
    expect(response.body.error).toBe('An error occurred while checking username availability'); // Validate the error message
    expect(mockedCheckUsernameAvailability).toHaveBeenCalledWith(username); // Ensure checkUsernameAvailability was called
  });
});
