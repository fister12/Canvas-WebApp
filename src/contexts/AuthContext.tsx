import React, { createContext, useContext } from 'react';

type MinimalAuth = {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (data?: any) => Promise<void>;
  signOut: () => Promise<void>;
};

const defaultAuth: MinimalAuth = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  signIn: async () => {},
  signOut: async () => {},
};

const AuthContext = createContext<MinimalAuth>(defaultAuth);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AuthContext.Provider value={defaultAuth}>{children}</AuthContext.Provider>;
};
