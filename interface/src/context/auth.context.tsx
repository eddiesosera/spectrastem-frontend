import React, { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextProps {
  isAuthenticated: boolean;
  login: () => void;
  register: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const register = () => {
    setIsAuthenticated(true);
    navigate("/dashboard");
  };

  const login = () => {
    setIsAuthenticated(true);
    navigate("/dashboard");
  };

  const logout = () => {
    setIsAuthenticated(false);
    navigate("/auth/login");
  };

  //   TODO: Reset password, OTP generate and confirm

  return (
    <AuthContext.Provider value={{ isAuthenticated, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
