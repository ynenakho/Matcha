import {
  AUTH_LOADING,
  AUTH_USER,
  AUTH_ERROR,
  SET_CURRENT_USER,
  EDIT_USER
} from './types';
import setAuthToken from '../components/common/setAuthToken';
import axios from 'axios';

export const editUser = (formValues, success, fail) => dispatch => {
  dispatch({ type: AUTH_LOADING });
  axios
    .post('/api/user/edit', formValues)
    .then(response => {
      dispatch({
        type: AUTH_USER,
        payload: response.data.token
      });
      localStorage.setItem('jwtToken', response.data.token);
      setAuthToken(response.data.token);
      dispatch(setCurrentUser(response.data.token));
      success();
    })
    .catch(e => {
      dispatch({
        type: AUTH_ERROR,
        payload: e.response.data.error
      });
      fail(e.response.data.error);
    });
};

export const setCurrentUser = token => dispatch => {
  dispatch({ type: AUTH_LOADING });
  axios
    .get('/api/current')
    .then(response => {
      dispatch({
        type: SET_CURRENT_USER,
        payload: response.data
      });
      dispatch({
        type: AUTH_USER,
        payload: token
      });
    })
    .catch(e =>
      dispatch({
        type: AUTH_ERROR,
        payload: e.response.data.error
      })
    );
};

export const signup = (
  { email, password, username },
  success,
  fail
) => dispatch =>
  axios
    .post('/api/signup', {
      email,
      password,
      username
    })
    .then(() => success())
    .catch(e => {
      dispatch({
        type: AUTH_ERROR,
        payload: e.response.data.error
      });
      fail(e.response.data.error);
    });

export const login = ({ username, password }, success, fail) => dispatch => {
  dispatch({ type: AUTH_LOADING });
  axios
    .post('/api/login', {
      username,
      password
    })
    .then(response => {
      dispatch({
        type: AUTH_USER,
        payload: response.data.token
      });
      localStorage.setItem('jwtToken', response.data.token);
      setAuthToken(response.data.token);
      dispatch(setCurrentUser(response.data.token));
      success();
    })
    .catch(e => {
      dispatch({
        type: AUTH_ERROR,
        payload: e.response.data.error
      });
      fail('Incorrect Username/Password.');
    });
};

export const logout = () => dispatch => {
  localStorage.removeItem('jwtToken');
  setAuthToken(false);
  dispatch({
    type: SET_CURRENT_USER,
    payload: {}
  });
  dispatch({
    type: AUTH_USER,
    payload: ''
  });
};

export const forgotPassword = ({ email }, callback, fail) => dispatch =>
  axios
    .post('/api/forgotpassword', { email })
    .then(response => callback())
    .catch(e => {
      dispatch({
        type: AUTH_ERROR,
        payload: e.response.data.error
      });
      fail(e.response.data.error);
    });
