const request = require('supertest');
process.env.NODE_ENV = 'test';
const app = require('../app');
jest.mock('../models/posts/updatePost');
const mockedUpdatePostModel = require('../models/posts/updatePost');

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

describe('Update post image', () => {
  test('Successfully updating post image', async () => {
    const postId = 'somePostId';
    const newImage = 'https://picsum.photos/200';

    mockedUpdatePostModel.mockImplementation((postId, updateData, callback) => {
      // Simulate a successful update operation
      const mockResult = {
        acknowledged: true,
        modifiedCount: 1,
      };
      // Execute the callback with the mock result
      callback(mockResult);
    });

    // Make the request

    const response = await agent
      .patch(`/updatePostImageUrl/${postId}`)
      .send({ updatedImageUrl: newImage });

    // Assertions
    expect(response.statusCode).toBe(201);
    expect(response.body.acknowledged).toBe(true);
    expect(mockedUpdatePostModel).toHaveBeenCalledWith(
      postId,
      { imageUrl: newImage },
      expect.any(Function)
    );
  }, 5000);

  test('Failing updating post image', async () => {
    const postId = 'somePostId';
    const newImage = 'https://picsum.photos/200';

    mockedUpdatePostModel.mockImplementation((postId, updateData, callback) => {
      // Simulate a successful update operation
      const mockResult = {
        acknowledged: false,
        modifiedCount: 0,
      };
      // Execute the callback with the mock result
      callback(mockResult);
    });

    // Make the request

    const response = await agent
      .patch(`/updatePostImageUrl/${postId}`)
      .send({ updatedImageUrl: newImage });

    // Assertions
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ message: 'Error updating post image' });
    expect(mockedUpdatePostModel).toHaveBeenCalledWith(
      postId,
      { imageUrl: newImage },
      expect.any(Function)
    );
  }, 5000);
});
