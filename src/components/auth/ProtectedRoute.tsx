import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = []
}) => {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login\" state={{ from: location }} replace />;
  }

  // If allowedRoles is empty, allow any authenticated user
  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Check if user has the required role
  if (currentUser && allowedRoles.includes(currentUser.role)) {
    return <>{children}</>;
  }

  // Redirect to unauthorized page if authenticated but doesn't have the required role
  return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;