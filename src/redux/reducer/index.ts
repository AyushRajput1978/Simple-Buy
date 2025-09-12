// redux/reducer/index.js
import { combineReducers } from 'redux';

import authReducer from './authSlice';
import cartReducer from './cartSlice';
import toastReducer from './toastSlice';

const rootReducers = combineReducers({
  userCart: cartReducer,
  auth: authReducer,
  toast: toastReducer,
});

export default rootReducers;
