import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import jwt_decode from 'jwt-decode';
import { SnackbarProvider } from 'notistack';

import * as serviceWorker from './serviceWorker';
import AppRouter from './AppRouter';

import setAuthToken from './components/common/setAuthToken';
import { setCurrentUser, logout } from './actions/authActions';
import reducers from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  { auth: { authenticated: localStorage.jwtToken } },
  composeEnhancers(applyMiddleware(reduxThunk))
);

if (localStorage.jwtToken) {
  const decoded = jwt_decode(localStorage.jwtToken);
  const currentTime = Date.now();
  const two_hours = 2 * 3600 * 1000;
  // Check for expiration of token (2 hours)
  if (decoded.iat + two_hours < currentTime) {
    store.dispatch(logout());
    window.location.href = '/login';
  } else {
    // Set auth token header auth
    setAuthToken(localStorage.jwtToken);
    store.dispatch(setCurrentUser(localStorage.jwtToken));
  }
}

ReactDOM.render(
  <Provider store={store}>
    <SnackbarProvider maxSnack={3}>
      <AppRouter />
    </SnackbarProvider>
  </Provider>,
  document.querySelector('#root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
