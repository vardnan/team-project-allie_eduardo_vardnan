import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';
import PhotoModal from '../components/PhotoModal';

jest.mock('../components/LikeButton', () => {
  return function MockedLikeButton() {
    return <button data-testid="like-button"></button>;
  };
});

jest.mock('../components/CommentSection', () => {
  return function MockedCommentSection() {
    return <div data-testid="comment-section"></div>;
  };
});

jest.mock('../components/CommentButton', () => {
  return function MockedCommentButton() {
    return <button data-testid="comment-button"></button>;
  };
});

jest.mock('../components/CommentInput', () => {
  return function MockedCommentInput() {
    return <textarea data-testid="comment-input"></textarea>;
  };
});

// Testing rendering
test('Testing that the PhotoModal is rendering correctly', () => {
  const props = {
    username: 'Alice',
    image: 'image.jpg',
    profileImage: 'profile.jpg',
    caption: 'Caption text',
    onClose: jest.fn(),
    comments: [],
    currentUser: 'Bob',
    likes: [],
  };

  const { getByAltText } = render(<PhotoModal {...props} />);
  expect(getByAltText('Caption text')).toBeInTheDocument();
});

// Snapshot testing
test('Testing that the PhotoModal matches snapshot', () => {
  const props = {
    username: 'Alice',
    image: 'image.jpg',
    profileImage: 'profile.jpg',
    caption: 'Caption text',
    onClose: jest.fn(),
    comments: [],
    currentUser: 'Bob',
    likes: [],
  };

  const component = renderer.create(<PhotoModal {...props} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

// Testing events

test('Testing the onClose function when the close button is clicked', () => {
  const mockOnClose = jest.fn();
  const props = {
    username: 'Alice',
    image: 'image.jpg',
    profileImage: 'profile.jpg',
    caption: 'Caption text',
    onClose: mockOnClose,
    comments: [],
    currentUser: 'Bob',
    likes: [],
  };

  const { container } = render(<PhotoModal {...props} />);
  const closeButton = container.querySelector('.closeButton');
  fireEvent.click(closeButton);
  expect(mockOnClose).toHaveBeenCalledTimes(1);
});
