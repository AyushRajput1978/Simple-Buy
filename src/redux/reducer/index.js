// redux/reducer/index.js
import { combineReducers } from "redux";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import toastReducer from "./toastSlice";

const rootReducers = combineReducers({
  userCart: cartReducer,
  auth: authReducer,
  toast: toastReducer,
});

export default rootReducers;
