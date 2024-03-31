import handleCartReducer from "./handleCart"
import { combineReducers } from "redux";
const rootReducers = combineReducers({
    handleCart:handleCartReducer,
})
export default rootReducers