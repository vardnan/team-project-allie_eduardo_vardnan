import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, waitFor } from '@testing-library/react';
import renderer from 'react-test-renderer';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import UserContext from '../contexts/user-context';
import ActivityFeed from '../components/ActivityFeed';

jest.mock('axios');

// Mock Data
const mockUser = {
  following: ['Bob', 'Charlie'],
};
const mockAllUsers = [
  { username: 'Bob', profileImage: 'bob.jpg' },
  { username: 'Charlie', profileImage: 'charlie.jpg' },
];
const mockPosts = [
  {
    id: '1',
    poster: 'Bob',
    isVideo: false,
    imageUrl: 'image1.jpg',
    caption: 'Caption 1',
  },
  {
    id: '2',
    poster: 'Charlie',
    isVideo: true,
    imageUrl: 'video2.mp4',
    caption: 'Caption 2',
  },
];

// Mock Context
const mockContext = {
  allUsers: mockAllUsers,
  currentUser: mockUser,
};

// Testing rendering
test('Testing that the ActivityFeed is rendering correctly', () => {
  const { getByText } = render(
    <MemoryRouter>
      <UserContext.Provider value={mockContext}>
        <ActivityFeed />
      </UserContext.Provider>
    </MemoryRouter>
  );
  expect(getByText('Bob')).toBeInTheDocument();
  expect(getByText('Charlie')).toBeInTheDocument();
});

test('Testing the rendering of images and videos based on isVideo prop', () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <UserContext.Provider value={mockContext}>
        <ActivityFeed />
      </UserContext.Provider>
    </MemoryRouter>
  );
  expect(getByTestId('feed-post-image-1')).toBeInTheDocument();
  expect(getByTestId('feed-post-video-2')).toBeInTheDocument();
});

// Snapshot testing
test('Testing that the ActivityFeed matches snapshot', () => {
  const component = renderer.create(
    <MemoryRouter>
      <UserContext.Provider value={mockContext}>
        <ActivityFeed />
      </UserContext.Provider>
    </MemoryRouter>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

// Testing events
test('Testing post filtering based on who the currentUser is following', async () => {
  const mockCurrentUser = { following: ['Alice'] };

  axios.get.mockResolvedValue({ data: mockPosts });

  const { getByText, queryByText } = render(
    <MemoryRouter>
      <UserContext.Provider
        value={{ currentUser: mockCurrentUser, allUsers: [] }}
      >
        <ActivityFeed />
      </UserContext.Provider>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(getByText('Caption 2')).toBeInTheDocument();
    expect(queryByText('Caption 1')).toBeNull();
  });
});
