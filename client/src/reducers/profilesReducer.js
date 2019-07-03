import { SET_PROFILES, LOADING_PROFILES, LOGOUT } from '../actions/types';

const INITIAL_STATE = {
  profiles: [],
  loading: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOADING_PROFILES:
      return {
        ...state,
        loading: true
      };
    case SET_PROFILES:
      return {
        ...state,
        profiles: action.payload,
        loading: false
      };
    case LOGOUT:
      return {
        ...INITIAL_STATE
      };
    default:
      return state;
  }
};
