import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';
import LikeButton from '../components/LikeButton';

// rendering testing
test('Testing that the Unlike state is set correctly', () => {
  const props = {
    currentUser: 'Alice',
    likes: ['Alice'],
    setLikes: jest.fn(),
  };

  const { getByText } = render(<LikeButton {...props} />);
  expect(getByText('Unlike')).toBeInTheDocument();
});

// snapshot testing
test('Like button matches snapshot', () => {
  const props = {
    currentUser: 'Alice',
    likes: ['Bob'],
    setLikes: jest.fn(),
  };

  const component = renderer.create(<LikeButton {...props} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

// event testing
test('The like button is toggling correctly', () => {
  const mockSetLikes = jest.fn();
  const props = {
    currentUser: 'Alice',
    likes: ['Bob'],
    setLikes: mockSetLikes,
  };

  const { getByText } = render(<LikeButton {...props} />);
  const button = getByText('Like');
  fireEvent.click(button);
  expect(mockSetLikes).toHaveBeenCalledWith(['Alice']);
});
