import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import auth from "./profile";


export default combineReducers({
  alert,
  auth,
  profile
});
