import {
  SET_ROOM_CHAT,
  CHAT_ERROR,
  DISPLAY_MESSAGE,
  SET_MESSAGES
} from './types';
import axios from 'axios';

export const createChat = userIds => dispatch => {
  return axios
    .post('/api/chat', { userIds })
    .then(response => {
      dispatch({
        type: SET_ROOM_CHAT,
        payload: response.data.chat
      });
      return response.data.chat;
    })
    .catch(e => {
      dispatch({
        type: CHAT_ERROR,
        payload: e.response.data.error
      });
    });
};

export const displayMessage = message => dispatch => {
  dispatch({
    type: DISPLAY_MESSAGE,
    payload: message
  });
};

export const sendMessage = (message, chatId) => dispatch => {
  return axios
    .post(`/api/chat/messages/${chatId}`, { message })
    .then(response => {
      dispatch(displayMessage(response.data.message));
      return response.data.message;
    })
    .catch(e => {
      dispatch({
        type: CHAT_ERROR,
        payload: e.response.data.error
      });
    });
};

export const getMessages = chatId => dispatch => {
  axios
    .get(`/api/chat/messages/${chatId}`)
    .then(response => {
      dispatch({
        type: SET_MESSAGES,
        payload: response.data.messages
      });
    })
    .catch(e => {
      dispatch({
        type: CHAT_ERROR,
        payload: e.response.data.error
      });
    });
};
