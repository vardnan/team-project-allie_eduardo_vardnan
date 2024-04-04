import React from 'react';
import { render, act } from '@testing-library/react';
import renderer from 'react-test-renderer';
import UserProfile from '../components/UserProfile';
import UserContext from '../contexts/user-context';
import axios from 'axios';

jest.mock('axios');

const mockContextValue = {
  currentUser: { username: 'Alice', profileImage: 'alice.jpg' },
  viewingUser: {
    username: 'Bob',
    profileImage: 'bob.jpg',
    followers: [],
    following: [],
    bio: 'Bio text',
  },
};

const mockPostsData = [
  {
    imageUrl: 'image1.jpg',
    caption: 'Caption 1',
    comments: [],
    likes: 0,
    isVideo: false,
  },
];

axios.get.mockResolvedValue({ data: mockPostsData });

// Testing rendering
test('Testing that the UserProfile is rendering correctly', async () => {
  await act(async () => {
    const { getByAltText, getByText } = render(
      <UserContext.Provider value={mockContextValue}>
        <UserProfile />
      </UserContext.Provider>
    );
    expect(getByAltText('User Profile')).toBeInTheDocument();
    expect(getByText('Bio text')).toBeInTheDocument();
  });
});

// Snapshot testing
test('Testing that the UserProfile matches snapshot', async () => {
  let component;
  await act(async () => {
    component = renderer.create(
      <UserContext.Provider value={mockContextValue}>
        <UserProfile />
      </UserContext.Provider>
    );
  });
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});