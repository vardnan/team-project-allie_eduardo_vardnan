import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
// import { UserContext } from '../contexts/user-context';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const drawerWidth = 150;

const sections = [
  { text: 'Home', icon: <HomeIcon />, link: '/' },
  { text: 'Search', icon: <SearchIcon />, link: '/search' },
  { text: 'Create', icon: <AddBoxIcon />, link: '/create' },
  { text: 'Profile', icon: <AccountBoxIcon />, link: '/profile' },
  { text: 'Hidden Posts', icon: <VisibilityOffIcon />, link: '/hidden' },
];

export default function NavBar() {
  // const { setViewingUser, currentUser } = useContext(UserContext);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const handleProfileClick = () => {
    // setViewingUser(currentUser);
    localStorage.setItem('viewingUser', JSON.stringify(currentUser));
  };

  // logout button click event handler.
  // RUBRIC: "JWT are invalidated when user logout"
  const handleLogout = () => {
    // detele the JWT
    localStorage.removeItem('app-token');
    localStorage.removeItem('username');
    // relaunch the app
    window.location.reload(true);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <List>
          {sections.map(({ text, icon, link }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                component={Link}
                to={link}
                onClick={handleProfileClick}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton onClick={ handleLogout }>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={'Log-out'} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
