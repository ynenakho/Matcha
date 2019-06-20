import {
  SET_ROOM_CHAT,
  LOADING_CHAT,
  DISPLAY_MESSAGE,
  SET_MESSAGES
} from '../actions/types';

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
    case DISPLAY_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        loading: false
      };
    case SET_MESSAGES:
      return {
        ...state,
        messages: action.payload,
        loading: false
      };
    default:
      return state;
  }
};
