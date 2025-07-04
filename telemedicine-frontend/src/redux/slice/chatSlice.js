// redux/slice/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    currentReceiverId: null, // 🧠 hansı istifadəçi ilə yazışma açıqdır
  },
  reducers: {
    setCurrentReceiverId: (state, action) => {
      state.currentReceiverId = action.payload;
    },
    clearCurrentReceiverId: (state) => {
      state.currentReceiverId = null;
    },
  },
});

export const { setCurrentReceiverId, clearCurrentReceiverId } = chatSlice.actions;
export default chatSlice.reducer;
