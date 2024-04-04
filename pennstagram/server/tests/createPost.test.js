const request = require('supertest');
const app = require('../app');
jest.mock('../models/createPost/newPost');
const mockedCreatePostModel = require('../models/createPost/newPost');

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


describe('Create post test', () => {
  test('Successfully created post', async () => {
    const postData = {
        poster: 'alice',
        imageUrl: 'https://source.unsplash.com/nKC772R_qog',
        caption: 'cat!!',
        timeOfPost: 'now',
        comments: [],
        likes: [],
        isVideo: false,
        posterProfileImage : 'https://source.unsplash.com/nKC772R_qog'
      };

    mockedCreatePostModel.mockImplementation((postData, callback) => {
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
      .post(`/posts`)
      .send(postData);

    // Add logging to see if we get to this point
    console.log('Response received', response.body);

    // Assertions
    expect(response.statusCode).toBe(201);
    expect(response.body.acknowledged).toBe(true);
    expect(mockedCreatePostModel).toHaveBeenCalledWith(postData, expect.any(Function));
  }, 5000);

  test('Failed to create post test', async () => {
    const postId = 'somePostId';
    const newCaption = 'This is a new caption';

    const postData = {};

    mockedCreatePostModel.mockImplementation((postData, callback) => {
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
      .post(`/posts`)
      .send(postData);

    // Add logging to see if we get to this point
    console.log('Response received', response.body);

    // Assertions
    expect(response.statusCode).toBe(401);
    expect(response.body.acknowledged).toBe(undefined);
    expect(mockedCreatePostModel).toHaveBeenCalledWith(postData, expect.any(Function));
  }, 5000);
});
