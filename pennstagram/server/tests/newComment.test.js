const request = require('supertest');
const app = require('../app');
jest.mock('../models/comment/comment');
const mockedCreateCommentModel = require('../models/comment/comment');

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


describe('Create comment test', () => {
  test('Successfully created comment', async () => {
    const postId = 'onid0990'
    const newCommentData = 'hello hello'

    mockedCreateCommentModel.mockImplementation((postId, newCommentData, callback) => {
      // Simulate a successful update operation
      const mockResult = {
        acknowledged: true
      };
      // Execute the callback with the mock result
      callback(mockResult);
    });

    // Make the request
    console.log('Making request');
    const response = await request(app)
      .post(`/posts/${postId}/comments`)
      .send({newCommentData});

    // Add logging to see if we get to this point
    console.log('Response received', response.body);

    // Assertions
    expect(response.statusCode).toBe(201);
    expect(response.body.acknowledged).toBe(true);
    expect(mockedCreateCommentModel).toHaveBeenCalledWith(postId, {newCommentData}, expect.any(Function));
  }, 5000);

  test('Failed to create comment', async () => {
    const postId = 'onid0990'
    const newCommentData = 'hello hello'

    mockedCreateCommentModel.mockImplementation((postId, newCommentData, callback) => {
      // Simulate a successful update operation
      const mockResult = {
        acknowledged: false
      };
      // Execute the callback with the mock result
      callback(mockResult);
    });

    // Make the request
    console.log('Making request');
    const response = await request(app)
      .post(`/posts/${postId}/comments`)
      .send({newCommentData});

    // Add logging to see if we get to this point
    console.log('Response received', response.body);

    // Assertions
    expect(response.statusCode).toBe(500);
    expect(response.body.acknowledged).toBe(undefined);
    expect(mockedCreateCommentModel).toHaveBeenCalledWith(postId, {newCommentData}, expect.any(Function));
  }, 5000);
});
