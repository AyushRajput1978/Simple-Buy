// redux/reducer/index.js
import { combineReducers } from "redux";
import handleCartReducer from "./handleCart";
import authReducer from "./authSlice";

const rootReducers = combineReducers({
  handleCart: handleCartReducer,
  auth: authReducer,
});

export default rootReducers;
