import {
  SET_PROFILE,
  PROFILE_LOADING,
  PROFILE_ERROR,
  CREATE_PROFILE,
  UPLOAD_PICTURE,
  SET_PICTURE,
  GET_ALL_PICTURES,
  LIKE_PICTURE,
  DELETE_PICTURE,
  SET_CONNECTION,
  DELETE_LIKES,
  REDUCE_RATING,
  SET_CURRENT_PROFILE
} from './types';
import axios from 'axios';

export const disconnectUser = userId => dispatch => {
  axios
    .post(`/api/disconnect/${userId}`)
    .then(response => {
      dispatch({
        type: SET_PROFILE,
        payload: response.data
      });
      dispatch({
        type: DELETE_LIKES,
        payload: response.data.likes
      });
    })
    .catch(e => {
      dispatch({
        type: PROFILE_ERROR,
        payload: e.response.data.error
      });
    });
};

export const blockUser = userId => dispatch => {
  axios
    .post(`/api/block/${userId}`)
    .then(response => {
      dispatch({
        type: SET_PROFILE,
        payload: response.data
      });
      dispatch({
        type: DELETE_LIKES,
        payload: response.data.likes
      });
    })
    .catch(e => {
      dispatch({
        type: PROFILE_ERROR,
        payload: e.response.data.error
      });
    });
};

export const deletePicture = pictureId => dispatch => {
  axios
    .post(`/api/picture/delete/${pictureId}`)
    .then(response => {
      dispatch({
        type: DELETE_PICTURE,
        payload: response.data.picture
      });
      dispatch({
        type: REDUCE_RATING,
        payload: response.data.rating
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
      dispatch({
        type: SET_CONNECTION,
        payload: response.data
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

  return axios
    .get(`/api/profile/${id}`)
    .then(response => {
      dispatch({
        type: SET_PROFILE,
        payload: response.data
      });
      return response.data.profile;
    })
    .catch(e => {
      dispatch({
        type: PROFILE_ERROR,
        payload: e.response.data.error
      });
    });
};

export const getPicture = id => dispatch => {
  axios
    .get(`/api/picture/${id}`)
    .then(response => {
      dispatch({
        type: SET_PICTURE,
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

export const makeAvatarPicture = pictureId => dispatch => {
  axios
    .post(`/api/picture/${pictureId}`)
    .then(response => {
      dispatch({
        type: SET_PICTURE,
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

export const createProfile = (
  formValues,
  success,
  fail,
  position,
  ip
) => dispatch => {
  axios
    .post('/api/profile', { ...formValues, position, ip })
    .then(response => {
      dispatch({
        type: CREATE_PROFILE,
        payload: response.data.profile
      });
      dispatch({
        type: SET_CURRENT_PROFILE,
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
  axios
    .post(`/api/upload-picture`, data)
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
