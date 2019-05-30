import _ from 'lodash';
import {
  SET_CURRENT_PROFILE,
  PROFILE_LOADING,
  CREATE_PROFILE,
  UPLOAD_PICTURE,
  SET_CURRENT_PICTURE,
  GET_ALL_PICTURES,
  LIKE_PICTURE,
  DELETE_PICTURE
} from '../actions/types';

const INITIAL_STATE = {
  pictures: [],
  profile: {},
  picture: {},
  loading: false
};

const getNewStateAfterLike = (state, like) => {
  const newState = Object.assign({}, state);
  newState.pictures = newState.pictures.map(picture => {
    if (
      picture._id === like._pictureId &&
      !_.find(picture.likes, { _id: like._id })
    ) {
      picture = Object.assign({}, picture);
      picture.likes = [...picture.likes, like];
    } else if (_.find(picture.likes, { _id: like._id })) {
      picture = Object.assign({}, picture);
      _.remove(picture.likes, { _id: like._id });
    }
    return picture;
  });
  return newState;
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LIKE_PICTURE:
      return getNewStateAfterLike(state, action.payload);
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
    case DELETE_PICTURE:
      return {
        ...state,
        pictures: state.pictures.filter(
          picture => picture._id !== action.payload._id
        ),
        picture:
          state.picture._id === action.payload._id && state.pictures.length > 1
            ? state.pictures.filter(
                picture => picture._id !== action.payload._id
              )[0]
            : {},
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
