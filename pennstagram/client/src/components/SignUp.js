import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  createTheme,
  ThemeProvider,
} from '@mui/material';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import validator from 'validator';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { checkUsernameAvailability, registerUser } from '../api/signup';
// import { UserContext } from '../contexts/user-context';

const defaultTheme = createTheme();

function SignUp({ onRegister }) {
  const navigate = useNavigate();
  // const { setCurrentUser, setViewingUser } = useContext(UserContext);

  useEffect(() => {
    document.title = 'Sign Up · Pennstagram';
  }, []);

  // State to hold the error message
  const [errorMessage, setErrorMessage] = useState('');

  const hasUpperCaseOrNumber = (str) => /[A-Z0-9]/.test(str);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const inputUsername = data.get('username');
    const inputPassword = data.get('password');
    const inputEmail = data.get('email');

    if (!validator.isLength(inputUsername, { min: 1, max: 20 })) {
      // eslint-disable-next-line
      alert('Username must be between 1 and 20 characters.');
      return;
    }

    if (validator.isNumeric(inputUsername.charAt(0))) {
      // eslint-disable-next-line
      alert('Username cannot start with a digit.');
      return;
    }

    if (!validator.isLength(inputPassword, { min: 1, max: 20 })) {
      // eslint-disable-next-line
      alert('Password must be between 1 and 20 characters.');
      return;
    }

    if (!hasUpperCaseOrNumber(inputPassword)) {
      // eslint-disable-next-line
      alert('Password must contain at least one uppercase letter or one number.');
      return;
    }

    if (!validator.isEmail(inputEmail)) {
      // eslint-disable-next-line
      alert('Invalid email format.');
      return;
    }

    try {
      const isUsernameAvailable = await checkUsernameAvailability(inputUsername);

      if (!isUsernameAvailable) {
        // Username is taken, set the error message
        setErrorMessage('Username is already taken');
        return;
      }

      const postData = {
        username: data.get('username'),
        password: data.get('password'),
        followers: [],
        following: [],
        profileImage: data.get('profilePicUrl'),
        bio: data.get('bio'),
      };

      // Note: the response is the user data
      // const response = await registerUser(postData);
      await registerUser(postData);
      // setCurrentUser(response);
      // setViewingUser(response);
      onRegister(data.get('username'));

      // Redirect to the home page upon successful registration
      navigate('/');
    } catch (error) {
      // eslint-disable-next-line
      console.error('Registration error:', error);
      // Handle registration error, e.g., show an error message to the user
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <CameraAltIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            {errorMessage && (
            <Typography variant="body2" color="error" align="center" sx={{ mb: 2 }}>
              {errorMessage}
            </Typography>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  data-cy="signup-email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  data-cy="signup-username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  data-cy="signup-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="profilePicUrl"
                  label="Profile Picture URL"
                  id="profilePicUrl"
                  data-cy="signup-image"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="bio"
                  label="Bio"
                  id="bio"
                  multiline
                  rows={2}
                  data-cy="signup-bio"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              data-cy="signup-button"
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                {/* Use RouterLink for navigation */}
                <RouterLink to="/login" variant="body2">
                  Already have an account? Log In
                </RouterLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

SignUp.propTypes = {
  onRegister: PropTypes.func.isRequired,
};

export default SignUp;
