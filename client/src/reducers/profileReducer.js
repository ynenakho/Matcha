import _ from 'lodash';
import {
  SET_PROFILE,
  PROFILE_LOADING,
  CREATE_PROFILE,
  UPLOAD_PICTURE,
  SET_PICTURE,
  GET_ALL_PICTURES,
  LIKE_PICTURE,
  DELETE_PICTURE,
  SET_CONNECTION,
  DELETE_LIKES,
  REDUCE_RATING,
  LOGOUT
} from '../actions/types';
import {
  DISCONNECTED_CONNECTION,
  CONNECTED_CONNECTION
} from '../components/common/events';
import { socket } from '../actions/authActions';

const INITIAL_STATE = {
  pictures: [],
  profile: {},
  picture: {},
  loading: true
};

const getNewStateAfterLike = (state, like) => {
  const newState = Object.assign({}, state);
  // const profile = Object.assign({}, newState.profile)
  newState.pictures = newState.pictures.map(picture => {
    if (
      picture._id === like._pictureId &&
      !_.find(picture.likes, { _id: like._id })
    ) {
      picture = Object.assign({}, picture);
      picture.likes = [...picture.likes, like];
      newState.profile.rating += 1;
    } else if (_.find(picture.likes, { _id: like._id })) {
      picture = Object.assign({}, picture);
      _.remove(picture.likes, { _id: like._id });
      newState.profile.rating -= 1;
    }
    return picture;
  });
  return newState;
};

const getNewStateAfterLikesDelete = (state, likes) => {
  const newState = Object.assign({}, state);
  newState.pictures = newState.pictures.map(picture => {
    picture = Object.assign({}, picture);
    for (let i = 0; i < likes.length; i++) {
      if (_.find(picture.likes, { _id: likes[i]._id })) {
        _.remove(picture.likes, { _id: likes[i]._id });
      }
    }
    return picture;
  });
  return newState;
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LIKE_PICTURE:
      return getNewStateAfterLike(state, action.payload);
    case DELETE_LIKES:
      return getNewStateAfterLikesDelete(state, action.payload);
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true
      };
    case SET_CONNECTION:
      if (
        state.profile.connected === true &&
        action.payload.connected === false
      ) {
        // DISCONNECT NOTIFICATION
        socket.emit(DISCONNECTED_CONNECTION, {
          userId: state.profile._userId,
          userName: action.payload.userName
        });
      }
      if (
        state.profile.connected === false &&
        action.payload.connected === true
      ) {
        // CONNECT NOTIFICATION
        socket.emit(CONNECTED_CONNECTION, {
          userId: state.profile._userId,
          userName: action.payload.userName
        });
      }
      return {
        ...state,
        profile: { ...state.profile, connected: action.payload.connected }
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
    case REDUCE_RATING:
      return {
        ...state,
        profile: {
          ...state.profile,
          rating: action.payload
        },
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
    case SET_PICTURE:
      return {
        ...state,
        picture: action.payload,
        loading: false
      };
    case SET_PROFILE:
      if (
        state.profile.connected === true &&
        action.payload.profile.connected === false
      ) {
        socket.emit(DISCONNECTED_CONNECTION, {
          userId: state.profile._userId,
          userName: action.payload.userName
        });
      }
      return {
        ...state,
        profile: action.payload.profile,
        loading: false
      };
    case CREATE_PROFILE:
      return {
        ...state,
        profile: action.payload,
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
