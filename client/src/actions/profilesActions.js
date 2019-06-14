import {
  GET_ALL_PROFILES,
  PROFILES_ERROR,
  LOADING_PROFILES,
  SEARCH_PROFILES
} from './types';
import axios from 'axios';

export const sortProfiles = (profiles, sortValues) => dispatch => {
  // Sorting!!!!
};

export const getProfiles = sexPref => dispatch => {
  dispatch({ type: LOADING_PROFILES });
  axios
    .get(`/api/profiles`, { params: { sexPref } })
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

export const searchProfiles = ({
  ageFrom,
  ageTo,
  location,
  rating,
  tags
}) => dispatch => {
  dispatch({ type: LOADING_PROFILES });
  axios
    .get(`/api/profiles/search`, {
      params: {
        ageFrom,
        ageTo,
        location,
        rating,
        tags
      }
    })
    .then(response => {
      dispatch({
        type: SEARCH_PROFILES,
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
