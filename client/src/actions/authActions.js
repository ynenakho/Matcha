import {
  AUTH_LOADING,
  AUTH_USER,
  AUTH_ERROR,
  SET_CURRENT_USER,
  SET_CURRENT_PROFILE,
  SET_CURRENT_PICTURE,
  SET_CURRENT_PICTURES,
  CHANGE_STATUS,
  LOGOUT,
  // EDIT_USER
} from './types';
import openSocket from 'socket.io-client';
import { JOIN_APP, LEAVE_APP } from '../components/common/events';
import setAuthToken from '../components/common/setAuthToken';
import { setSocket } from './socketActions';
import axios from 'axios';
import moment from 'moment';

export const socket = openSocket('https://matcha-sv.herokuapp.com/');

export const changeOnlineStatus = (status) => (dispatch) => {
  axios
    .patch('/api/changeonlinestatus', { status })
    .then((response) => {
      dispatch({
        type: CHANGE_STATUS,
        payload: response.data.status,
      });
    })
    .catch((e) =>
      dispatch({
        type: AUTH_ERROR,
        payload: e.response.data.error,
      })
    );
};

export const editUser = (formValues, success, fail) => (dispatch) => {
  axios
    .post('/api/user/edit', formValues)
    .then((response) => {
      localStorage.setItem('jwtToken', response.data.token);
      setAuthToken(response.data.token);
      dispatch(setCurrentUser(response.data.token, () => {}));
      success();
    })
    .catch((e) => {
      dispatch({
        type: AUTH_ERROR,
        payload: e.response.data.error,
      });
      fail(e.response.data.error);
    });
};

export const setCurrentUser = (token, success) => (dispatch) => {
  dispatch({ type: AUTH_LOADING });
  return axios
    .get('/api/current')
    .then((response) => {
      dispatch({
        type: SET_CURRENT_USER,
        payload: response.data.user,
      });
      dispatch({
        type: SET_CURRENT_PROFILE,
        payload: response.data.profile,
      });

      dispatch({
        type: SET_CURRENT_PICTURE,
        payload: response.data.picture,
      });
      dispatch({
        type: SET_CURRENT_PICTURES,
        payload: response.data.pictures,
      });
      dispatch({
        type: AUTH_USER,
        payload: token,
      });
      dispatch(changeOnlineStatus('online'));
      success(response.data.user.id);
      dispatch(setSocket(socket));
      socket.emit(JOIN_APP, { userId: response.data.user.id });
      return socket;
    })
    .catch((e) =>
      dispatch({
        type: AUTH_ERROR,
        payload: e.response.data.error,
      })
    );
};

export const signup = ({ email, password, username }, success, fail) => (
  dispatch
) =>
  axios
    .post('/api/signup', {
      email,
      password,
      username,
    })
    .then(() => success())
    .catch((e) => {
      dispatch({
        type: AUTH_ERROR,
        payload: e.response.data.error,
      });
      fail(e.response.data.error);
    });

export const login = ({ username, password }, success, fail) => (dispatch) => {
  dispatch({ type: AUTH_LOADING });
  axios
    .post('/api/login', {
      username,
      password,
    })
    .then((response) => {
      dispatch({
        type: AUTH_USER,
        payload: response.data.token,
      });
      localStorage.setItem('jwtToken', response.data.token);
      setAuthToken(response.data.token);
      dispatch(setCurrentUser(response.data.token, success));
    })
    .catch((e) => {
      dispatch({
        type: AUTH_ERROR,
        payload: e.response.data.error,
      });
      fail('Incorrect Username/Password.');
    });
};

export const logout = (userId) => (dispatch) => {
  if (userId) {
    socket.emit(LEAVE_APP, { userId });
  }
  dispatch(
    changeOnlineStatus(
      `${moment(new Date()).format('MM/DD/YYYY hh:mm a').toString()}`
    )
  );
  localStorage.removeItem('jwtToken');
  setAuthToken(false);
  dispatch({
    type: LOGOUT,
  });
};

export const forgotPassword = ({ email }, callback, fail) => (dispatch) =>
  axios
    .post('/api/forgotpassword', { email })
    .then((response) => callback())
    .catch((e) => {
      dispatch({
        type: AUTH_ERROR,
        payload: e.response.data.error,
      });
      fail(e.response.data.error);
    });
