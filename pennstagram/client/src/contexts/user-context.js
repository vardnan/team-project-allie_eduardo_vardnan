import React, {
  createContext,
  useState,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

export const UserContext = createContext({
  viewingUser: null,
  currentUser: null,
  setUserId: () => {},
});

export function UserContextProvider({ children, username, setUsername }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  const value = useMemo(
    () => ({
      username,
      currentUser,
      setCurrentUser,
      setUsername,
      viewingUser,
      setViewingUser,
    }),
    [username, currentUser, setCurrentUser, viewingUser, setUsername, setViewingUser],
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  username: PropTypes.string,
  setUsername: PropTypes.func,
};

UserContextProvider.defaultProps = {
  username: '',
  setUsername: () => {},
};

export default UserContextProvider;
