import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import CreatePost from '../components/CreatePost';
import axios from 'axios';
import UserContext from '../contexts/user-context';

jest.mock('axios'); // Mock Axios

describe('CreatePost Component', () => {
  // Mock the UserContext for currentUser
  const currentUser = { username: 'testuser' };

  it('renders the CreatePost form', () => {
    render(
      <UserContext.Provider value={{ currentUser }}>
        <CreatePost />
      </UserContext.Provider>
    );
    const createPostForm = screen.getByTestId('create-post-form');
    expect(createPostForm).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(
      <UserContext.Provider value={{ currentUser }}>
        <CreatePost />
      </UserContext.Provider>
    );

    // Simulate user input
    const imageURLInput = screen.getByLabelText('Image URL');
    const captionInput = screen.getByLabelText('Caption');
    const submitButton = screen.getByText('Create Post');

    fireEvent.change(imageURLInput, { target: { value: 'test-image-url' } });
    fireEvent.change(captionInput, { target: { value: 'Test caption' } });

    // Mock the Axios post request
    axios.post.mockResolvedValue({ data: { status: 'success' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      // Assert that the form submission logic is working
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/posts', {
        poster: currentUser.username,
        imageUrl: 'test-image-url',
        caption: 'Test caption',
        timeOfPost: expect.any(String), // You can adjust this as per your code
        comments: [],
        likes: [],
        isVideo: false, // Assuming false by default
      });
    });
  });
});

