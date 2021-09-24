import React, { createContext, useContext, useState, useEffect } from 'react';
import IUser from './../interfaces/user.interface';
import { getUser, removeUserSession } from './../helpers/session.helper';
import { useHistory } from 'react-router-dom';

type ContextType = {
  user: IUser | null;
  loadingUser: boolean;
  setCurrentUser: (user: IUser) => void;
  unsetCurrentUser: () => void;
};

const AuthContext = createContext<ContextType>({
  user: null,
  loadingUser: true,
  setCurrentUser: () => ({}),
  unsetCurrentUser: () => ({}),
});

const useAuth = () => useContext(AuthContext);

const AuthContextProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const token = getUser();
    if (token) {
      setUser(token);
      setLoadingUser(false);
    }
    return;
  }, []);

  const setCurrentUser = (user: IUser) => {
    setUser(user);
  };

  const unsetCurrentUser = () => {
    setUser(null);
    removeUserSession();
    history.push('/login');
  };

  const contextValue = {
    user,
    loadingUser,
    setCurrentUser,
    unsetCurrentUser,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export { useAuth, AuthContextProvider };
