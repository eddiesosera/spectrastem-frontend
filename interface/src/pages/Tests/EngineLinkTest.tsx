// Testing if frontend can coumminicate with python engine.
import React, { useEffect, useState } from "react";
import axios from "axios";

const TestCommunication: React.FC = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch the message from the Flask backend
    axios
      .get(" http://127.0.0.1:5000/api/hello")
      .then((response) => {
        setMessage(response.data.message); // Set message from backend
      })
      .catch((error) => {
        console.error("Error fetching from backend:", error);
      });
  }, []);

  return (
    <div>
      <h1>Communication Test</h1>
      <p>{message}</p> {/* Display the message from Flask backend */}
    </div>
  );
};

export default TestCommunication;
