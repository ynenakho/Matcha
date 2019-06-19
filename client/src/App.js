import React, { Component } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { withStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import jwt_decode from 'jwt-decode';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as authActions from './actions/authActions';
import setAuthToken from './components/common/setAuthToken';
import _ from 'lodash';

const styles = {
  approot: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 'calc(100vh - 32px)'
    // margin: 0
  }
};

class App extends Component {
  componentDidMount() {
    const { setCurrentUser, logout } = this.props;
    if (localStorage.jwtToken) {
      const decoded = jwt_decode(localStorage.jwtToken);
      const currentTime = Date.now();
      const two_hours = 2 * 3600 * 1000;
      // Check for expiration of token (2 hours)
      if (decoded.iat + two_hours < currentTime) {
        logout();
        window.location.href = '/login';
      } else {
        // Set auth token header auth
        setAuthToken(localStorage.jwtToken);
        setCurrentUser(localStorage.jwtToken, () => {});
      }
    }
  }
  render() {
    const { children, classes, auth } = this.props;
    if ((auth.authenticated && _.isEmpty(auth.user)) || auth.loading) {
      return (
        <div className={classes.approot}>
          <Header />
          <Container className="">
            <div>Loading...</div>
          </Container>

          <Footer />
        </div>
      );
    } else {
      return (
        <div className={classes.approot}>
          <Header />
          <Container className="">{children}</Container>
          <Footer />
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    authActions
  )
)(App);
