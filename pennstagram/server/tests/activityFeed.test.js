const request = require('supertest');
const app = require('../app');
jest.mock('../models/activityFeed/posts');
const mockedActivityModel = require('../models/activityFeed/posts');

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


describe('fetch activity feed test', () => {
  test('Unsuccessfully fetched activity feed (unverified user)', async () => {
    const currUserUsername = 'alice123';
    const usernames = [];

    mockedActivityModel.mockImplementation((usernames, currUserUsername, callback) => {
      // Simulate a successful update operation
      const mockResult = {
        acknowledged: true,
        data: [{
            "id": "post001",
            "poster": "alice123",
            "imageUrl": "https://source.unsplash.com/I1zq15IcJek",
            "caption": "Jelly fish!!",
            "comments": [
              {
                "username": "bob_smith",
                "comment": "Hey you are soo cool",
                "commenterProfileImage": "https://source.unsplash.com/_M6gy9oHgII"
              },
              {
                "username": "diana_p",
                "comment": "Cool photo!",
                "commenterProfileImage": "https://source.unsplash.com/mEZ3PoFGs_k"
              },
              {
                "username": "julia_f",
                "comment": "Awesome!!"
              }
            ],
            "likes": [
              "bob_smith",
              "diana_p"
            ],
            "isVideo": false,
            "timeOfPost": "5 hours ago",
            "posterProfileImage": "https://source.unsplash.com/3TLl_97HNJo"
          }]
      };
      // Execute the callback with the mock result
      callback(mockResult);
    });

    // Make the request
    console.log('Making request');
    const response = await request(app)
      .post(`/activityFeedPosts`)
      .send({usernames: usernames, currUserUsername: currUserUsername});

    // Add logging to see if we get to this point
    console.log('Response received', response.body);

    // Assertions
    expect(response.statusCode).toBe(401);
  }, 5000);

});
