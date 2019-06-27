import {
  AUTH_ERROR,
  PROFILE_ERROR,
  PROFILES_ERROR,
  HISTORY_ERROR,
  CHAT_ERROR,
  LOGOUT
} from '../actions/types';

const INITIAL_STATE = {
  auth: '',
  profile: '',
  profiles: '',
  history: '',
  chat: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case HISTORY_ERROR:
      return {
        ...state,
        history: action.payload
      };
    case CHAT_ERROR:
      return {
        ...state,
        chat: action.payload
      };
    case PROFILES_ERROR:
      return {
        ...state,
        profiles: action.payload
      };
    case AUTH_ERROR:
      return {
        ...state,
        auth: action.payload
      };
    case PROFILE_ERROR:
      return {
        ...state,
        profile: action.payload
      };
    case LOGOUT:
      return {
        ...INITIAL_STATE
      };
    default:
      return state;
  }
};
