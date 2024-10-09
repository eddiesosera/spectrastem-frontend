// File: frontend/pages/Home/Home.tsx
import React from "react";
import FileUpload from "../../components/Input/FileUpload";

const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {/* Include the FileUpload component */}
      <FileUpload />
    </div>
  );
};

export default Home;
