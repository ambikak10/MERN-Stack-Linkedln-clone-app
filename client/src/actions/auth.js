import axios from 'axios';
import { setAlert} from './alert';
import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR } from "./types";
import setAuthToken from '../utils/setAuthToken';

//Load User
export const loadUser = () => async dispatch => {
  if(localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get('/api/auth')
  } catch(err) {

  }
}
//Register User
export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
    'Content-Type': 'application/json'
   }
}
  const body = JSON.stringify({ name, email, password });
  console.log(body);
  try {
    const res = await axios.post("api/users", body, config);
    console.log(res);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(errors);
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: REGISTER_FAIL
    });
  }
};