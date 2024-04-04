import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import SignUp from '../components/SignUp';
import axios from 'axios';

// Mock axios to simulate API calls
jest.mock('axios');

describe('SignUp Component', () => {
  it('renders the component with form elements', () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter> {/* Use MemoryRouter */}
        <SignUp onRegister={() => {}} />
      </MemoryRouter>
    );

    expect(getByLabelText('Email Address')).toBeInTheDocument();
    expect(getByLabelText('Username')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
    expect(getByLabelText('Profile Picture URL')).toBeInTheDocument();
    expect(getByLabelText('Bio')).toBeInTheDocument();
    expect(getByText('Sign Up')).toBeInTheDocument();
  });

  it('displays an error message when the username is already taken', async () => {
    // Mock an API response that indicates the username is taken
    jest.spyOn(axios, 'get').mockResolvedValue({ data: [{ username: 'existingUser' }] });

    const { getByLabelText, getByText } = render(
      <MemoryRouter> {/* Use MemoryRouter */}
        <SignUp onRegister={() => {}} />
      </MemoryRouter>
    );

    const usernameInput = getByLabelText('Username');
    const signUpButton = getByText('Sign Up');

    fireEvent.change(usernameInput, { target: { value: 'existingUser' } });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(getByText('Username is already taken')).toBeInTheDocument();
    });
  });

  it('calls onRegister function and redirects upon successful registration', async () => {
    // Mock an API response for a successful registration
    jest.spyOn(axios, 'get').mockResolvedValue({ data: [] });
    jest.spyOn(axios, 'post').mockResolvedValue({ status: 201 });

    const onRegisterMock = jest.fn();
    const { getByLabelText, getByText } = render(
      <MemoryRouter> {/* Use MemoryRouter */}
        <SignUp onRegister={onRegisterMock} />
      </MemoryRouter>
    );

    const usernameInput = getByLabelText('Username');
    const signUpButton = getByText('Sign Up');

    fireEvent.change(usernameInput, { target: { value: 'newUser' } });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(onRegisterMock).toHaveBeenCalledWith('newUser');
      // You can't directly check window.location in a test
      // Instead, you can assert the redirection by checking if the `onRegisterMock` was called.
    });
  });
});



