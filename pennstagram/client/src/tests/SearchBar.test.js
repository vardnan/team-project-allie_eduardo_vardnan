// SearchBar.test.js
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import axios from 'axios';
import SearchBar from './SearchBar';

// Mock axios
jest.mock('axios');

describe('SearchBar', () => {
  it('renders the component correctly', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText('Search for a user')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(<SearchBar />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('handles a successful search', async () => {
    // Mock axios response
    axios.get.mockResolvedValue({
      data: [
        {
          username: 'testuser',
          profileImage: 'test-image-url',
          bio: 'Test bio',
        },
      ],
    });

    render(<SearchBar />);

    const input = screen.getByPlaceholderText('Search for a user');
    const searchButton = screen.getByText('Search');

    fireEvent.change(input, { target: { value: 'testuser' } });
    fireEvent.click(searchButton);

    // Wait for the search to complete
    await screen.findByText('User Found:');

    expect(screen.getByText('Username: testuser')).toBeInTheDocument();
    expect(screen.getByText('Bio: Test bio')).toBeInTheDocument();
  });

  it('handles an unsuccessful search', async () => {
    // Mock axios response for no user found
    axios.get.mockResolvedValue({ data: [] });

    render(<SearchBar />);

    const input = screen.getByPlaceholderText('Search for a user');
    const searchButton = screen.getByText('Search');

    fireEvent.change(input, { target: { value: 'nonexistentuser' } });
    fireEvent.click(searchButton);

    // Wait for the search to complete
    await screen.findByText('User not found');

    expect(screen.queryByText('User Found:')).toBeNull();
  });

  it('handles an error during search', async () => {
    // Mock axios to simulate an error
    axios.get.mockRejectedValue(new Error('Search failed'));

    render(<SearchBar />);

    const input = screen.getByPlaceholderText('Search for a user');
    const searchButton = screen.getByText('Search');

    fireEvent.change(input, { target: { value: 'testuser' } });
    fireEvent.click(searchButton);

    // Wait for the error message to appear
    await screen.findByText('Error searching for user:');

    expect(screen.queryByText('User Found:')).toBeNull();
  });
});
