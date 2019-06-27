import {
  SAVE_TO_HISTORY,
  LOADING_HISTORY,
  SET_VISITED_HISTORY,
  SET_VISITORS_HISTORY,
  LOGOUT
} from '../actions/types';

const INITIAL_STATE = {
  visitors: [],
  visited: [],
  loading: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOADING_HISTORY:
      return {
        ...state,
        loading: true
      };
    case SAVE_TO_HISTORY:
      return {
        ...state,
        visited: [action.payload, ...state.visited],
        loading: false
      };
    case SET_VISITED_HISTORY:
      return {
        ...state,
        visited: action.payload,
        loading: false
      };
    case SET_VISITORS_HISTORY:
      return {
        ...state,
        visitors: action.payload,
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
