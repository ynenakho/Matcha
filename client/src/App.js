import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import jwt_decode from 'jwt-decode';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as authActions from './actions/authActions';
import * as socketActions from './actions/socketActions';
import setAuthToken from './components/common/setAuthToken';
import _ from 'lodash';
import { NOTIFICATION_RECIEVED } from './components/common/events';
import { withSnackbar } from 'notistack';
import Loader from './components/common/Loader';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { socket } from './actions/authActions';

const styles = {
  approot: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 'calc(100vh)',
    width: '100%'
  }
};

class App extends Component {
  async componentDidMount() {
    const { setCurrentUser, logout, enqueueSnackbar } = this.props;
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
    socket.on(NOTIFICATION_RECIEVED, ({ notification }) => {
      enqueueSnackbar(`${notification}`, {
        variant: 'info'
      });
    });
  }

  render() {
    const { children, classes, auth } = this.props;
    if ((auth.authenticated && _.isEmpty(auth.user)) || auth.loading) {
      return (
        <div className={classes.approot}>
          <Header />
          <Loader />
          <Footer />
        </div>
      );
    } else {
      return <div className={classes.approot}>{children}</div>;
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
    { ...authActions, ...socketActions }
  ),
  withSnackbar
)(App);
