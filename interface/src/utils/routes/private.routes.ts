import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    // if (!isAuthenticated) {
    //   navigate("/auth/login");
    // }
  }, [isAuthenticated, navigate]);

  // return isAuthenticated ? children : null; // Return null while redirecting
  return children;
};

export default PrivateRoute;
