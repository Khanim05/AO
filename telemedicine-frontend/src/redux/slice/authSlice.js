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
  darkMode: localStorage.getItem("darkMode") === "true", // ✅ burda əlavə olundu
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const rawUser = action.payload.user;

      // console.log("📥 Backend user:", rawUser);

      const userWithId = {
        ...rawUser,
        userId: rawUser.id, // 🔥 id varsa userId kimi kopyalayırıq
      };

      // console.log("📦 Final user to store:", userWithId);

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

      // Clear from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
     toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", state.darkMode); // ✅ yadda saxla
    },
  },
});

export const { loginSuccess, logout,toggleDarkMode } = authSlice.actions;
export default authSlice.reducer;
