import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import posts from "./post";


export default combineReducers({
  alert,
  auth,
  profile,
  posts
});
