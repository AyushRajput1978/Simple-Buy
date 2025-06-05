// redux/reducer/index.js
import { combineReducers } from "redux";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";

const rootReducers = combineReducers({
  userCart: cartReducer,
  auth: authReducer,
});

export default rootReducers;
