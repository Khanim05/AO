import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";
import notificationReducer from "../slice/notificationSlice";
import chatReducer from "../slice/chatSlice"; // ✅ bunu əlavə et

const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    chat: chatReducer,
  },
});

export default store;
