import {
  SET_CURRENT_PROFILE,
  PROFILE_LOADING,
  PROFILE_ERROR,
  CREATE_PROFILE,
  UPLOAD_PICTURE,
  SET_CURRENT_PICTURE,
  GET_ALL_PICTURES
} from './types';
import axios from 'axios';

export const getAllPictures = () => dispatch => {
  dispatch({ type: PROFILE_LOADING });
  axios
    .get('/api/pictures')
    .then(response => {
      dispatch({
        type: GET_ALL_PICTURES,
        payload: response.data.pictures
      });
    })
    .catch(e => {
      dispatch({
        type: PROFILE_ERROR,
        payload: e.response.data.error
      });
    });
};

export const getProfile = () => dispatch => {
  dispatch({ type: PROFILE_LOADING });
  axios
    .get('/api/profile')
    .then(response => {
      dispatch({
        type: SET_CURRENT_PROFILE,
        payload: response.data.profile
      });
    })
    .catch(e => {
      dispatch({
        type: PROFILE_ERROR,
        payload: e.response.data.error
      });
    });
};

export const getPicture = () => dispatch => {
  dispatch({ type: PROFILE_LOADING });
  axios
    .get('/api/picture')
    .then(response => {
      dispatch({
        type: SET_CURRENT_PICTURE,
        payload: response.data.picture
      });
    })
    .catch(e => {
      dispatch({
        type: PROFILE_ERROR,
        payload: e.response.data.error
      });
    });
};

export const createProfile = (formValues, success, fail) => dispatch => {
  dispatch({ type: PROFILE_LOADING });
  axios
    .post('/api/profile', { ...formValues })
    .then(response => {
      dispatch({
        type: CREATE_PROFILE,
        payload: response.data.profile
      });
      success();
    })
    .catch(e => {
      dispatch({
        type: PROFILE_ERROR,
        payload: e.response.data.error
      });
      fail(e.response.data.error);
    });
};

export const uploadPicture = (data, success, fail) => dispatch => {
  // dispatch({ type: PROFILE_LOADING });
  axios
    .post(`/api/profile/picture`, data)
    .then(response => {
      dispatch({
        type: UPLOAD_PICTURE,
        payload: response.data.picture
      });
      success();
    })
    .catch(e => {
      dispatch({
        type: PROFILE_ERROR,
        payload: e.response.data.error
      });
      fail(e.response.data.error);
    });
};
