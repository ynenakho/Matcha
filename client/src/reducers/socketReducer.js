import { SET_SOCKET, LOGOUT } from '../actions/types';

const INITIAL_STATE = {
  socket: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_SOCKET:
      return {
        ...state,
        socket: action.payload
      };
    case LOGOUT:
      return {
        ...INITIAL_STATE
      };
    default:
      return state;
  }
};
