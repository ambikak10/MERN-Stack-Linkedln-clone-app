import { GET_PROFILE } from "../actions/types";

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error:{}
}
export default function(state = initialState) {
 const { type, payload } = action;
 switch(type) {
   case GET_PROFILE: 
   return {
     ...state,
     profile: payload,
     loading: false
  }
   case PROFILE_ERROR:
     return {
      ...state,
      error: payload,
      loading: false
     }
 }
}
