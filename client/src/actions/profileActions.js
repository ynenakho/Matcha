import {
  SET_CURRENT_PROFILE,
  PROFILE_LOADING,
  PROFILE_ERROR,
  CREATE_PROFILE,
  UPLOAD_PICTURE,
  SET_CURRENT_PICTURE,
  GET_ALL_PICTURES,
  LIKE_PICTURE,
  DELETE_PICTURE
} from './types';
import axios from 'axios';

export const deletePicture = pictureId => dispatch => {
  axios
    .post(`/api/picture/delete/${pictureId}`)
    .then(response => {
      dispatch({
        type: DELETE_PICTURE,
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

export const likePicture = (pictureId, userId) => dispatch => {
  axios
    .post(`/api/picture/like/${pictureId}/${userId}`)
    .then(response => {
      dispatch({
        type: LIKE_PICTURE,
        payload: response.data.like
      });
    })
    .catch(e => {
      dispatch({
        type: PROFILE_ERROR,
        payload: e.response.data.error
      });
    });
};

export const getAllPictures = userId => dispatch => {
  dispatch({ type: PROFILE_LOADING });
  axios
    .get(`/api/pictures/${userId}`)
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

export const getProfile = id => dispatch => {
  dispatch({ type: PROFILE_LOADING });
  axios
    .get(`/api/profile/${id}`)
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

export const getPicture = id => dispatch => {
  dispatch({ type: PROFILE_LOADING });
  axios
    .get(`/api/picture/${id}`)
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
