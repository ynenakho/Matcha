import {
  AUTH_ERROR,
  PROFILE_ERROR,
  PROFILES_ERROR,
  HISTORY_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  auth: '',
  profile: '',
  profiles: '',
  history: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case HISTORY_ERROR:
      return {
        ...state,
        history: action.payload
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
    default:
      return state;
  }
};
