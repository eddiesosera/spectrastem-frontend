import React from "react";
// import { useAuth } from "../../context/auth.context";

const ResetPassword: React.FC = () => {
  //   const { resetPassword } = useAuth();

  const handleResetPassword = () => {
    // ResetPassword logic here
    // resetPassword();
  };

  return (
    <div>
      <h1>ResetPassword Page</h1>
      <button onClick={handleResetPassword}>ResetPassword</button>
    </div>
  );
};

export default ResetPassword;
