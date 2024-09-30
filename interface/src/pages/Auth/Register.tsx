import React from "react";
import { useAuth } from "../../context/auth.context";

const Register: React.FC = () => {
  const { register } = useAuth();

  const handleRegister = () => {
    // Logic:
    register();
  };

  return (
    <div>
      <h1>Register Page</h1>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
