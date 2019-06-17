import {
  AUTH_LOADING,
  AUTH_USER,
  SET_CURRENT_USER,
  EDIT_USER
} from '../actions/types';

const INITIAL_STATE = {
  authenticated: '',
  user: {},
  loading: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_LOADING:
      return {
        ...state,
        loading: true
      };
    case AUTH_USER:
      return {
        ...state,
        authenticated: action.payload
        // loading: false
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        user: action.payload,
        loading: false
      };
    case EDIT_USER:
      return {
        ...state,
        user: action.payload
        // loading: false
      };
    default:
      return state;
  }
};
