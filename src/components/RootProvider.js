import React from 'react';
import { AuthProvider } from '../context/AuthContext';

const RootProvider = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default RootProvider;
