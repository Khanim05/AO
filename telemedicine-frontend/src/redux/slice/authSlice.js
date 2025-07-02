import { createSlice } from "@reduxjs/toolkit";

let storedUser = null;
try {
  const userStr = localStorage.getItem("user");
  if (userStr && userStr !== "undefined") {
    storedUser = JSON.parse(userStr);
  }
} catch (err) {
  console.error("JSON parse xətası (authSlice):", err);
}

const initialState = {
  user: storedUser,
  token: localStorage.getItem("token") || null,
  justLoggetOut: false,
  darkMode: localStorage.getItem("darkMode") === "true",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const rawUser = action.payload.user;

     

      const userWithId = {
        ...rawUser,
        userId: rawUser.id, 
      };

    

      state.user = userWithId;
      state.token = action.payload.token;
      state.justLoggetOut = false;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(userWithId));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.justLoggetOut = true;

      
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
     toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", state.darkMode);
    },
  },
});

export const { loginSuccess, logout,toggleDarkMode } = authSlice.actions;
export default authSlice.reducer;
