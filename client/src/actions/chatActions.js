import { SET_ROOM_CHAT, CHAT_ERROR } from './types';
import axios from 'axios';

export const createChat = userIds => dispatch => {
  axios
    .post('/api/chat', { userIds })
    .then(response => {
      dispatch({
        type: SET_ROOM_CHAT,
        payload: response.data.chat
      });
    })
    .catch(e => {
      dispatch({
        type: CHAT_ERROR,
        payload: e.response.data.error
      });
    });
};
