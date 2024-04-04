import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import Home from '../components/Home';

describe('Home', () => {
  it('renders the Home component with ActivityFeed', () => {
    const originalTitle = document.title; // Store the original title

    // Create a test spy for document.title
    jest.spyOn(document, 'title', 'set');

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Assert that the document title is set to 'Pennstagram'
    expect(document.title).toBe('Pennstagram');

    // Restore the original title
    document.title = originalTitle;

    // Assert that the Home component is rendered
    const homeContainer = screen.getByTestId('home-container');
    expect(homeContainer).toBeInTheDocument();

    // Assert that the ActivityFeed component is present
    const activityFeed = screen.getByTestId('activity-feed');
    expect(activityFeed).toBeInTheDocument();
  });
});


