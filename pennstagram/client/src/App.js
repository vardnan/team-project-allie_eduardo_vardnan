import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import CreatePost from './components/CreatePost';
import SearchBar from './components/SearchBar';
import { UserContextProvider } from './contexts/user-context';
import SignUp from './components/SignUp';
import HiddenPosts from './components/HiddenPosts';

// const jwt = require('jsonwebtoken');

function App() {
  // const [username, setUsername] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('username') === null ? '' : localStorage.getItem('username'));
  // const [token] = useState(localStorage.getItem('app-token') !== null);
  // console.log('hey!');
  // console.log(token);
  // console.log(localStorage.getItem('app-token'));
  // console.log('username!');
  // console.log(username);
  // console.log(localStorage.getItem('username'));

  return (
    <BrowserRouter>
      <UserContextProvider username={username} setUsername={setUsername}>
        {username && <NavBar />}
        <div>
          <Routes>
            <Route
              path="/signup"
              element={<SignUp onRegister={setUsername} />}
            />
            <Route
              path="*"
              element={
                username ? <AppRoutes /> : <Login onLogin={setUsername} />
              }
            />
          </Routes>
        </div>
      </UserContextProvider>
    </BrowserRouter>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/search" element={<SearchBar />} />
      <Route path="/hidden" element={<HiddenPosts />} />
    </Routes>
  );
}

export default App;
