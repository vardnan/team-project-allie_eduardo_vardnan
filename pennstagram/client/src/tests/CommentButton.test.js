import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CommentButton from '../components/CommentButton';

// rendering testing
test('Testing that the CommentButton is rendering correctly', () => {
  const props = {
    setIsCommentButtonClicked: jest.fn(),
  };

  const { getByText } = render(<CommentButton {...props} />);
  expect(getByText('Comment')).toBeInTheDocument();
});

// event testing
test('Testing that the CommentButton onClick works correctly', () => {
  const mockSetIsCommentButtonClicked = jest.fn();
  const props = {
    setIsCommentButtonClicked: mockSetIsCommentButtonClicked,
  };

  const { getByText } = render(<CommentButton {...props} />);
  const button = getByText('Comment');
  fireEvent.click(button);
  expect(mockSetIsCommentButtonClicked).toHaveBeenCalledWith(true);
});
