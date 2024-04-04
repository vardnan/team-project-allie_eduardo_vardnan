import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';
import CommentInput from '../components/CommentInput';

// Testing rendering

test('Testing that the CommentInput is rendering correctly', () => {
  const props = {
    currentUser: 'Alice',
    comments: [],
    focusOnLoad: false,
    setComments: () => {},
  };

  const { getByRole } = render(<CommentInput {...props} />);
  expect(getByRole('textbox')).toBeInTheDocument();
});

test('Testing that the text area has the correct placeholder text', () => {
  const props = {
    currentUser: 'Alice',
    comments: [],
    focusOnLoad: false,
    setComments: () => {},
  };

  const { getByPlaceholderText } = render(<CommentInput {...props} />);
  expect(getByPlaceholderText('Add a comment')).toBeInTheDocument();
});

test('Testing that text area is focused if focusOnLoad === true', () => {
  const props = {
    currentUser: 'Alice',
    comments: [],
    focusOnLoad: true,
    setComments: () => {},
  };

  const { getByPlaceholderText } = render(<CommentInput {...props} />);

  const textArea = getByPlaceholderText('Add a comment');

  expect(document.activeElement).toBe(textArea);
});

test('Testing that text area is unfocused if focusOnLoad === false', () => {
  const props = {
    currentUser: 'Alice',
    comments: [],
    focusOnLoad: false,
    setComments: () => {},
  };

  const { getByPlaceholderText } = render(<CommentInput {...props} />);

  const textArea = getByPlaceholderText('Add a comment');

  expect(document.activeElement).not.toBe(textArea);
});

test('Testing that the text area has an initial empty value', () => {
  const props = {
    currentUser: 'Alice',
    comments: [],
    focusOnLoad: false,
    setComments: () => {},
  };
  const { getByPlaceholderText } = render(<CommentInput {...props} />);
  expect(getByPlaceholderText('Add a comment')).toHaveValue('');
});

// Snapshot testing

test('Testing that the CommentInput matches snapshot', () => {
  const props = {
    currentUser: 'Alice',
    comments: [],
    focusOnLoad: false,
    setComments: () => {},
  };

  const component = renderer.create(<CommentInput {...props} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

// Testing events

test('Testing that the value of the comment is being updated as users are typing', () => {
  const props = {
    currentUser: 'Alice',
    comments: [],
    focusOnLoad: false,
    setComments: () => {},
  };

  const { getByPlaceholderText } = render(<CommentInput {...props} />);
  const textArea = getByPlaceholderText('Add a comment');

  fireEvent.change(textArea, { target: { value: 'New comment' } });

  expect(textArea.value).toBe('New comment');
});

test('Testing the triggering of onSubmit() when pressing "Enter" without also pressing the "Shift" key', () => {
  const mockSetComments = jest.fn();
  const props = {
    currentUser: 'Alice',
    comments: [],
    setComments: mockSetComments,
    focusOnLoad: false,
  };

  const { getByPlaceholderText } = render(<CommentInput {...props} />);
  const textarea = getByPlaceholderText('Add a comment');

  fireEvent.change(textarea, { target: { value: 'New comment' } });
  fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' });

  expect(mockSetComments).toHaveBeenCalledWith([
    ...props.comments,
    { username: props.currentUser, comment: 'New comment' },
  ]);
});

test('Testing if an empty comment does not trigger onSubmit()', () => {
  const mockSetComments = jest.fn();
  const props = {
    currentUser: 'Alice',
    comments: [],
    setComments: mockSetComments,
    focusOnLoad: false,
  };

  const { getByPlaceholderText } = render(<CommentInput {...props} />);
  const textarea = getByPlaceholderText('Add a comment');

  fireEvent.change(textarea, { target: { value: '   ' } });
  fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' });

  expect(mockSetComments).not.toHaveBeenCalled();
});

test('Testing that the CommentInput clears the comment field after submission', () => {
  const props = {
    currentUser: 'Alice',
    comments: [],
    setComments: () => {},
    focusOnLoad: false,
  };

  const { getByPlaceholderText } = render(<CommentInput {...props} />);
  const textarea = getByPlaceholderText('Add a comment');

  fireEvent.change(textarea, { target: { value: 'New comment' } });
  fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' });

  expect(textarea.value).toBe('');
});
