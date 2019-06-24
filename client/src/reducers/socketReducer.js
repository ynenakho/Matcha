import { SET_SOCKET } from '../actions/types';

const INITIAL_STATE = {
  socket: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_SOCKET:
      console.log('SETTING SOCKET =', action.payload);

      return {
        ...state,
        socket: action.payload
      };
    default:
      return state;
  }
};
