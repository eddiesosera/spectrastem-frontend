import React, { useEffect } from "react";
import Waveform from "../../components/Input/Waveform/waveform";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Home: React.FC = () => {
  const userSubscription = useSelector(
    (state: RootState) => state.user.userDetails.accountType
  );

  // Access the environment variable using import.meta.env.VITE_API_BASE_URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    console.log("API_BASE_URL:", API_BASE_URL);
  }, []);

  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <Waveform />
      Account type: {userSubscription}
    </div>
  );
};

export default Home;
