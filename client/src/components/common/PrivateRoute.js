import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authenticated ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);

const mapStateToPtops = state => ({
  authenticated: state.auth.authenticated
});

export default connect(mapStateToPtops)(PrivateRoute);
