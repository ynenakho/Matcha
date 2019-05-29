import {
  SET_CURRENT_PROFILE,
  PROFILE_LOADING,
  CREATE_PROFILE,
  UPLOAD_PICTURE,
  SET_CURRENT_PICTURE,
  GET_ALL_PICTURES
} from '../actions/types';

const INITIAL_STATE = {
  pictures: [],
  profile: {},
  picture: {},
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true
      };
    case UPLOAD_PICTURE:
      return {
        ...state,
        picture: action.payload,
        pictures: [...state.pictures, action.payload],
        loading: false
      };
    case GET_ALL_PICTURES:
      return {
        ...state,
        pictures: action.payload,
        loading: false
      };
    case SET_CURRENT_PICTURE:
      return {
        ...state,
        picture: action.payload,
        loading: false
      };
    case SET_CURRENT_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      };
    case CREATE_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      };
    default:
      return state;
  }
};
