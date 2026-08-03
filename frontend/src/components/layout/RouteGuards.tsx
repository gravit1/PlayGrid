import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-steam-bg text-steam-text">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-steam-bg text-steam-text">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'ROLE_ADMIN') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-steam-bg text-steam-text">
        <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
        <p className="text-xl">Access Denied: Admins Only</p>
      </div>
    );
  }

  return <>{children}</>;
};
