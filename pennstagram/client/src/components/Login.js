import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  // Link,
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
import { loginUser } from '../api/login'; // Import the updated API function
// import { UserContext } from '../contexts/user-context';

const defaultTheme = createTheme();

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const { setCurrentUser, setViewingUser } = useContext(UserContext);

  useEffect(() => {
    document.title = 'Login · Pennstagram';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validator.isLength(username, { min: 1, max: 20 })) {
      // eslint-disable-next-line
      alert('Username must be between 1 and 20 characters.');
      return;
    }
    if (validator.isNumeric(username.charAt(0))) {
      // eslint-disable-next-line
      alert('Username cannot start with a digit.');
      return;
    }
    if (!validator.isLength(password, { min: 1, max: 20 })) {
      // eslint-disable-next-line
      alert('Password must be between 1 and 20 characters.');
      return;
    }

    try {
      const user = await loginUser(username, password);
      // setCurrentUser(user);
      // setViewingUser(user);
      // TODO: Do we need the below? Probably ont anymore that we are using localStorage
      onLogin(user.username);
    } catch (error) {
      // eslint-disable-next-line
      alert(`Error: ${error.message}`);
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
            Log In
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-cy="username"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-cy="password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              data-cy="sign-in"
            >
              Sign In
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item>
                {/* Use RouterLink for navigation */}
                <RouterLink to="/signup" variant="body2">
                  Don&apos;t have an account? Sign Up
                </RouterLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

// Add prop types for the onLogin prop
Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
