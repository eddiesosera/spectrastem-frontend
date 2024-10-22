import { createSlice } from "@reduxjs/toolkit";

interface IUserDetails {
  username: string;
  email: string;
  occupation?: string;
  accountType: "freemium" | "premium";
  freeTokensLeft: number;
}

interface IUserCredentials {
  jwt_token: string;
  password: string;
}

interface IUserState {
  isLoggedIn: boolean;
  userDetails: IUserDetails;
  userCredentials: IUserCredentials;
}

const initialState: IUserState = {
  isLoggedIn: false,
  userDetails: {
    username: "Login",
    email: "None",
    accountType: "freemium",
    freeTokensLeft: 5,
  },
  userCredentials: {
    jwt_token: "",
    password: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
