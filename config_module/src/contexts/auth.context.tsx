import React, { createContext, useContext, useState, useEffect } from 'react';
import IUser from './../interfaces/user.interface';
import { getUser } from './../helpers/session.helper';

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

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

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
  };

  const contextValue = {
    user,
    loadingUser,
    setCurrentUser,
    unsetCurrentUser,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
