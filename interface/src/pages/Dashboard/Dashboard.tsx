import React from "react";
import { useAuth } from "../../context/auth.context";

const Dashboard: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
