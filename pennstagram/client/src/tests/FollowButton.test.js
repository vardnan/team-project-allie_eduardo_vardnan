import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';
import FollowButton from '../components/FollowButton';
import UserContext from '../contexts/user-context';

// Mock functions
const mockFollowUser = jest.fn();
const mockUnfollowUser = jest.fn();

// Mock Context
const mockContext = {
  currentUser: { following: ['Bob'] },
  followUser: mockFollowUser,
  unfollowUser: mockUnfollowUser,
};

// Testing rendering
test('Testing that the FollowButton is rendering correctly when already following', () => {
  const { getByText } = render(
    <UserContext.Provider value={mockContext}>
      <FollowButton viewingUsername="Bob" />
    </UserContext.Provider>
  );
  expect(getByText('Unfollow')).toBeInTheDocument();
});

test('Testing that the FollowButton is rendering correctly when not following', () => {
  const { getByText } = render(
    <UserContext.Provider value={mockContext}>
      <FollowButton viewingUsername="Alice" />
    </UserContext.Provider>
  );
  expect(getByText('Follow')).toBeInTheDocument();
});

// Snapshot testing
test('Testing that the FollowButton matches snapshot', () => {
  const component = renderer.create(
    <UserContext.Provider value={mockContext}>
      <FollowButton viewingUsername="Bob" />
    </UserContext.Provider>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

// Testing events
test('Testing the toggleFollow function when initially following', () => {
  const { getByText } = render(
    <UserContext.Provider value={mockContext}>
      <FollowButton viewingUsername="Bob" />
    </UserContext.Provider>
  );
  fireEvent.click(getByText('Unfollow'));
  expect(mockUnfollowUser).toHaveBeenCalledWith('Bob');
  expect(getByText('Follow')).toBeInTheDocument();
});

test('Testing the toggleFollow function when initially not following', () => {
  const { getByText } = render(
    <UserContext.Provider value={mockContext}>
      <FollowButton viewingUsername="Alice" />
    </UserContext.Provider>
  );
  fireEvent.click(getByText('Follow'));
  expect(mockFollowUser).toHaveBeenCalledWith('Alice');
  expect(getByText('Unfollow')).toBeInTheDocument();
});
