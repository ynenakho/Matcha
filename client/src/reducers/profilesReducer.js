import { GET_ALL_PROFILES, LOADING_PROFILES } from '../actions/types';

const INITIAL_STATE = {
  profiles: [],
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOADING_PROFILES:
      return {
        ...state,
        loading: true
      };
    case GET_ALL_PROFILES:
      return {
        ...state,
        profiles: action.payload,
        loading: false
      };
    default:
      return state;
  }
};
