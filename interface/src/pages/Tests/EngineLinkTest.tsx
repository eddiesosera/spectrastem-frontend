// Testing if frontend can coumminicate with python engine.
import React from "react";
// import axios from "axios";
import FileUpload from "../../components/Input/FileUpload";

const TestCommunication: React.FC = () => {
  return (
    <div>
      <h1>Communication Test</h1>
      <FileUpload />
    </div>
  );
};

export default TestCommunication;
