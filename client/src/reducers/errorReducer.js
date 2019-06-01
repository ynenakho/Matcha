import { AUTH_ERROR, PROFILE_ERROR, PROFILES_ERROR } from '../actions/types';

const INITIAL_STATE = {
  auth: '',
  profile: '',
  profiles: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
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
