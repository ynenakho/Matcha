import { AUTH_ERROR, PROFILE_ERROR } from '../actions/types';

const INITIAL_STATE = {
  auth: '',
  profile: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
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
