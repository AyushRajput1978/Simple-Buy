// redux/slices/toastSlice.js
import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    show: false,
    message: "",
    success: true,
  },
  reducers: {
    showToast: (state, action) => {
      state.show = true;
      state.message = action.payload.message;
      state.success = action.payload.success;
    },
    hideToast: (state) => {
      state.show = false;
      state.message = "";
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
