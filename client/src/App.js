import React, { Component } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { withStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import jwt_decode from 'jwt-decode';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as authActions from './actions/authActions';
import * as socketActions from './actions/socketActions';
import setAuthToken from './components/common/setAuthToken';
import _ from 'lodash';
import { NOTIFICATION_RECIEVED } from './components/common/events';
import { withSnackbar } from 'notistack';

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
  async componentDidMount() {
    const { setCurrentUser, logout, enqueueSnackbar } = this.props;
    // const socket = openSocket('http://localhost:4000');
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
        const socket = await setCurrentUser(localStorage.jwtToken, () => {});

        socket.on(NOTIFICATION_RECIEVED, ({ notification, userName }) => {
          console.log('notification recieved', notification);
          enqueueSnackbar(`${notification}`, {
            variant: 'info'
          });
        });
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
  // socket: state.socket.socket
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { ...authActions, ...socketActions }
  ),
  withSnackbar
)(App);
