import {
  AUTH_LOADING,
  AUTH_USER,
  SET_CURRENT_USER,
  SET_CURRENT_PROFILE,
  SET_CURRENT_PICTURE,
  SET_CURRENT_PICTURES,
  EDIT_USER,
  CHANGE_STATUS,
  LOGOUT
} from '../actions/types';

const INITIAL_STATE = {
  authenticated: '',
  user: {},
  profile: {},
  picture: {},
  pictures: [],
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
    case CHANGE_STATUS:
      return {
        ...state,

        profile:
          action.payload !== 'No Profile'
            ? { ...state.profile, lastVisit: action.payload }
            : state.profile,
        loading: false
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        user: action.payload
        // loading: false
      };
    case SET_CURRENT_PICTURE:
      return {
        ...state,
        picture: action.payload
        // loading: false
      };
    case SET_CURRENT_PICTURES:
      return {
        ...state,
        pictures: action.payload
        // loading: false
      };
    case SET_CURRENT_PROFILE:
      return {
        ...state,
        profile: action.payload
        // loading: false
      };
    case EDIT_USER:
      return {
        ...state,
        user: action.payload
        // loading: false
      };
    case LOGOUT:
      return {
        ...INITIAL_STATE
      };
    default:
      return state;
  }
};
