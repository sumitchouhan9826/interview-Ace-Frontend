import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user && !user.isVerified) {
    // This case might be handled by the backend 403, but good to have here
    return <Navigate to="/verify-otp" state={{ email: user.email }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
