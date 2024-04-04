// Mock axios to simulate API calls
import React from 'react';
import { render} from '@testing-library/react';
import Login from '..components/Login';
jest.mock('axios');

describe('Login Component', () => {
  it('renders the component with form elements', () => {
    const { getByLabelText, getByText } = render(<Login onLogin={() => {}} />);

    expect(getByLabelText('Username')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
    expect(getByText('Sign In')).toBeInTheDocument();
    expect(getByText("Don't have an account? Sign Up")).toBeInTheDocument();
  });
});