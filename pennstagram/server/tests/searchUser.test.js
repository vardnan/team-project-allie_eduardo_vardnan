const request = require('supertest');
const app = require('../app'); // Replace with the correct path to your app file
const searchUserByUsername = require('../models/searchUser/searchUser'); // Update the path accordingly

jest.mock('../models/searchUser/searchUser');
const mockedSearchUserByUsername = require('../models/searchUser/searchUser');

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

describe('Search User Route', () => {
    test('Successfully find user', async () => {
        const mockUser = {
          _id: {
            $oid: "653d836f6d83612f36ab2094"
          },
          id: "12345",
          name: "Alice Johnson",
          username: "alice123",
          password: "password123",
          profileImage: "https://source.unsplash.com/3TLl_97HNJo",
          bio: "Just another passionate photographer 📸. Exploring the world one click at a time!",
          followers: [
            "bob_smith",
            "charlie_b",
            "diana_p",
            "eddie_k",
            "george_h"
          ],
          following: [
            "charlie_b",
            "diana_p",
            "bob_smith"
          ]
        };
    
        // Mock the searchUserByUsername function to simulate finding a user
        mockedSearchUserByUsername.mockImplementation((username) => {
          if (username === 'alice123') {
            return mockUser;
          }
          return null;
        });
    
        const response = await agent
          .get('/searchUser')
          .query({ username: 'alice123' }); // Replace 'alice123' with the username to find
    
        expect(response.status).toBe(200); // Ensure status code for successful search
        expect(response.body).toEqual(mockUser); // Ensure correct user data is returned
        expect(mockedSearchUserByUsername).toHaveBeenCalledWith('alice123'); // Ensure searchUserByUsername was called with the correct username
      });

  test('Error in user search', async () => {
    const username = 'errorUser';

    // Mock the searchUserByUsername function to simulate an error in user search
    mockedSearchUserByUsername.mockImplementation((username) => {
      throw new Error('Error: Unable to search for user');
    });

    const response = await agent
      .get('/searchUser')
      .query({ username });

    expect(response.status).toBe(401); // Ensure status code for error in search
    expect(response.body.error).toBe('An error occurred while searching for the user'); // Ensure correct error message
    expect(mockedSearchUserByUsername).toHaveBeenCalledWith(username); // Ensure searchUserByUsername was called with the correct username
  });
});

