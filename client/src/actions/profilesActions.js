import { GET_ALL_PROFILES, PROFILES_ERROR, LOADING_PROFILES } from './types';
import axios from 'axios';

export const getProfiles = () => dispatch => {
  dispatch({ type: LOADING_PROFILES });
  axios
    .get(`/api/profiles`)
    .then(response => {
      dispatch({
        type: GET_ALL_PROFILES,
        payload: response.data.profiles
      });
    })
    .catch(e => {
      dispatch({
        type: PROFILES_ERROR,
        payload: e.response.data.error
      });
    });
};
