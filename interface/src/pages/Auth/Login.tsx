import React from "react";
import { useAuth } from "../../context/auth.context";

const Login: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = () => {
    // Add login logic here
    login();
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
