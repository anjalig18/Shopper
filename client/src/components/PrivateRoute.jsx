import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const admin = localStorage.getItem('admin');
  return admin ? children : <Navigate to="/admin/login" />;
};

export default PrivateRoute; 