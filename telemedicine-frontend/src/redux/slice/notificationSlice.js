// redux/slice/notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hasNotification: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state) => {
      state.hasNotification = true;
    },
    clearNotification: (state) => {
      state.hasNotification = false;
    },
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
