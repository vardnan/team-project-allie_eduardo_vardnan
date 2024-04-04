const request = require('supertest');
const app = require('../app');
jest.mock('../models/posts/deletePost');
const mockedCreatePostModel = require('../models/posts/deletePost');

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


describe('Create post test', () => {
  test('Successfully deleted post', async () => {

    const postId = 'kod90jd';
    mockedCreatePostModel.mockImplementation((postId, callback) => {
      // Simulate a successful update operation
      const mockResult = {
        acknowledged: true,
        deletedCount: 1
      };
      // Execute the callback with the mock result
      callback(mockResult);
    });

    // Make the request
    console.log('Making request');
    const response = await request(app)
      .delete(`/removePost/${postId}`)

    // Add logging to see if we get to this point
    console.log('Response received', response.body);

    // Assertions
    expect(response.statusCode).toBe(201);
    expect(response.body.acknowledged).toBe(true);
    expect(mockedCreatePostModel).toHaveBeenCalledWith(postId, expect.any(Function));
  }, 5000);

  test('Failed to delete post', async () => {

    const postId = '_';
    mockedCreatePostModel.mockImplementation((postId, callback) => {
      // Simulate a successful update operation
      const mockResult = {
        acknowledged: true,
        deletedCount: 0
      };
      // Execute the callback with the mock result
      callback(mockResult);
    });

    // Make the request
    console.log('Making request');
    const response = await request(app)
      .delete(`/removePost/${postId}`)

    // Add logging to see if we get to this point
    console.log('Response received', response.body);

    // Assertions
    expect(response.statusCode).toBe(400);
    expect(response.body.acknowledged).toBe(undefined);
    expect(mockedCreatePostModel).toHaveBeenCalledWith(postId, expect.any(Function));
  }, 5000);
});
