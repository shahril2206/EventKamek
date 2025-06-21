// src/contexts/AuthContext.js
import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role') || '';
    const storedEmail = localStorage.getItem('email') || '';
    const storedToken = localStorage.getItem('token') || '';

    setRole(storedRole);
    setEmail(storedEmail);
    setToken(storedToken);
  }, []);

  const login = (token, email, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('role', role);

    setToken(token);
    setEmail(email);
    setRole(role);
  };

  const logout = () => {
    localStorage.clear();
    setToken('');
    setEmail('');
    setRole('');
  };

  return (
    <AuthContext.Provider value={{ token, email, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
