import {
  SET_PROFILES,
  PROFILES_ERROR,
  LOADING_PROFILES
  // SEARCH_PROFILES,
  // SORT_PROFILES
} from './types';
import axios from 'axios';
import geodist from 'geodist';

export const getBlockedProfiles = () => dispatch => {
  // Get blocked profiles
  dispatch({ type: LOADING_PROFILES });
  axios
    .get(`/api/profiles/blocked`)
    .then(response => {
      dispatch({
        type: SET_PROFILES,
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

export const getConnectedProfiles = () => dispatch => {
  // Get connected profiles
  dispatch({ type: LOADING_PROFILES });
  axios
    .get(`/api/profiles/connected`)
    .then(response => {
      dispatch({
        type: SET_PROFILES,
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

export const getLikedYouProfiles = () => dispatch => {
  // Get liked you profiles
  dispatch({ type: LOADING_PROFILES });
  axios
    .get(`/api/profiles/likedyou`)
    .then(response => {
      dispatch({
        type: SET_PROFILES,
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

export const sortProfiles = (profiles, profile, sort) => dispatch => {
  if (profiles.length > 1) {
    if (sort === 'age') {
      profiles.sort((a, b) => {
        if (!a.birthDate) {
          return 1;
        } else if (!b.birthDate) {
          return -1;
        }
        return (
          new Date(b.birthDate).getTime() - new Date(a.birthDate).getTime()
        );
      });
    } else if (sort === 'tags') {
      profiles.sort((a, b) => {
        if (!a.interests.length) {
          return 1;
        } else if (!b.interests.length) {
          return -1;
        }
        return (
          b.interests.filter(value =>
            profile.interests
              .map(value => value.toLowerCase())
              .includes(value.toLowerCase())
          ).length -
          a.interests.filter(value =>
            profile.interests
              .map(value => value.toLowerCase())
              .includes(value.toLowerCase())
          ).length
        );
      });
    } else if (sort === 'rating') {
      profiles.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'location') {
      if (profile.location && profile.longitude && profile.latitude) {
        profiles.sort((a, b) => {
          if (a.longitude && b.longitude)
            return (
              geodist(
                { lat: profile.latitude, lon: profile.longitude },
                { lat: a.latitude, lon: a.longitude }
              ) -
              geodist(
                { lat: profile.latitude, lon: profile.longitude },
                { lat: b.latitude, lon: b.longitude }
              )
            );
          else if (a.longitude) {
            return 1;
          } else {
            return -1;
          }
        });
      }
    }
    dispatch({
      type: SET_PROFILES,
      payload: profiles
    });
  }
};

export const getProfiles = sexPref => dispatch => {
  dispatch({ type: LOADING_PROFILES });
  axios
    .get(`/api/profiles`, { params: { sexPref } })
    .then(response => {
      dispatch({
        type: SET_PROFILES,
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
        type: SET_PROFILES,
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
