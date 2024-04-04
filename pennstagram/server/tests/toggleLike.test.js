const request = require('supertest');
const app = require('../app');
jest.mock('../models/toggleLike/toggleLike');
const mockedToggle = require('../models/toggleLike/toggleLike');

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

// ... your tests, using 'agent' instead of 'request(app)' ...

afterAll((done) => {
  if (server && server.listening) {
    server.close(done);
  } else {
    done();
  }
});


describe('Toogle likes', () => {
  test('Successfully toggled ', async () => {
    const postId = 'onid0990'
    const currUsername = 'bob_rosario'
    const like = true;

    mockedToggle.mockImplementation((postId, currUsername, like, callback) => {
      // Simulate a successful update operation
      const mockResult = {
        acknowledged: true
      };
      // Execute the callback with the mock result
    //   callback(mockResult);
    });

    // Make the request
    console.log('Making request');
    const response = await request(app)
      .patch(`/toggleLike/${postId}`)
      .send({currUsername: currUsername, like: like});

    // Add logging to see if we get to this point
    console.log('Response received', response.body);

    // Assertions
    expect(response.statusCode).toBe(200);
    expect(response.body.acknowledged).toBe(undefined);
    expect(mockedToggle).toHaveBeenCalledWith(postId, currUsername, like);
  }, 5000);
});
