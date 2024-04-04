import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import CommentSection from '../components/CommentSection';
import UserContext from '../contexts/user-context';

// Mock Data
const mockUser = {
  username: 'Alice',
  profileImage: 'alice.jpg',
};

const mockAllUsers = [
  { username: 'Alice', profileImage: 'alice.jpg' },
  { username: 'Bob', profileImage: 'bob.jpg' },
];

const mockComments = [
  {
    username: 'Bob',
    comment: 'Great post!',
  },
  {
    username: 'Alice',
    comment: 'Thank you!',
  },
];

// Mock Context
const mockContext = {
  allUsers: mockAllUsers,
};

// Testing rendering
test('Testing that the CommentSection is rendering correctly', () => {
  const props = {
    comments: mockComments,
    caption: 'Caption text',
    profileImage: mockUser.profileImage,
    postUser: mockUser.username,
  };

  const { getByText } = render(
    <UserContext.Provider value={mockContext}>
      <CommentSection {...props} />
    </UserContext.Provider>
  );
  expect(getByText('Caption text')).toBeInTheDocument();
  expect(getByText('Great post!')).toBeInTheDocument();
  expect(getByText('Thank you!')).toBeInTheDocument();
});

// Snapshot testing
test('Testing that the CommentSection matches snapshot', () => {
  const props = {
    comments: mockComments,
    caption: 'Caption text',
    profileImage: mockUser.profileImage,
    postUser: mockUser.username,
  };

  const component = renderer.create(
    <UserContext.Provider value={mockContext}>
      <CommentSection {...props} />
    </UserContext.Provider>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
