import React from 'react';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import NavBar from '../components/NavBar';

// testing rendering
test('renders the NavBar component', () => {
  render(
    <BrowserRouter>
      <NavBar />
    </BrowserRouter>
  );

  const homeLink = screen.getByText('Home');
  const searchLink = screen.getByText('Search');
  const createLink = screen.getByText('Create');
  const profileLink = screen.getByText('Profile');

  expect(homeLink).toBeInTheDocument();
  expect(searchLink).toBeInTheDocument();
  expect(createLink).toBeInTheDocument();
  expect(profileLink).toBeInTheDocument();
});

// snapshot testing
test('matches snapshot', () => {
  const tree = renderer.create(
    <BrowserRouter>
      <NavBar />
    </BrowserRouter>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
