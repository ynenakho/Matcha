import { SET_ROOM_CHAT, LOADING_CHAT } from '../actions/types';

const INITIAL_STATE = {
  chat: {},
  chatWith: [],
  messages: [],
  loading: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOADING_CHAT:
      return {
        ...state,
        loading: true
      };
    case SET_ROOM_CHAT:
      return {
        ...state,
        chat: action.payload,
        loading: false
      };
    default:
      return state;
  }
};
