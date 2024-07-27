import React, { useContext } from 'react';
import { Navigate, Outlet,useLocation } from 'react-router-dom';
import { AuthContext } from '../providers/AuthContext'; // Adjust the import path as necessary

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);

  const location=useLocation();

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { auth } = authContext;

  if (!auth.isAuthenticated) {
    return <Navigate to="/login"  state={{from : location}}/>;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
