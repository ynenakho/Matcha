import {
  SAVE_TO_HISTORY,
  LOADING_HISTORY,
  HISTORY_ERROR,
  SET_VISITED_HISTORY,
  SET_VISITORS_HISTORY
} from './types';
import axios from 'axios';

export const saveToHistory = userId => dispatch => {
  dispatch({ type: LOADING_HISTORY });
  axios
    .post(`/api/history`, { userId })
    .then(response => {
      dispatch({
        type: SAVE_TO_HISTORY,
        payload: response.data.history
      });
    })
    .catch(e => {
      dispatch({
        type: HISTORY_ERROR,
        payload: e.response.data.error
      });
    });
};

export const getVisitors = () => dispatch => {
  dispatch({ type: LOADING_HISTORY });
  axios
    .get(`/api/visitors`)
    .then(response => {
      dispatch({
        type: SET_VISITORS_HISTORY,
        payload: response.data.history
      });
    })
    .catch(e => {
      dispatch({
        type: HISTORY_ERROR,
        payload: e.response.data.error
      });
    });
};

export const getVisited = () => dispatch => {
  dispatch({ type: LOADING_HISTORY });
  axios
    .get(`/api/visited`)
    .then(response => {
      dispatch({
        type: SET_VISITED_HISTORY,
        payload: response.data.history
      });
    })
    .catch(e => {
      dispatch({
        type: HISTORY_ERROR,
        payload: e.response.data.error
      });
    });
};
