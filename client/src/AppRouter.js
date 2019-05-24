import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Landing from './components/landing/Landing';
import App from './App';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
// import SignOut from './components/auth/SignOut';
// import Settings from './components/Settings/Settings';
// import TakePicture from './components/takePicture/TakePicture';
// import ForgotPassword from './components/auth/ForgotPassword';
import PrivateRoute from './components/common/PrivateRoute';
// import withAuth from './components/common/withAuth';
import Profile from './components/profile/Profile';
import CreateProfile from './components/profile/CreateProfile';
import EditUser from './components/profile/EditUser';

export class AppRouter extends Component {
  render() {
    return (
      <BrowserRouter>
        <App>
          <Route path="/" exact component={Landing} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={SignUp} />

          {/* <Route path="/signout" exact component={SignOut} /> */}
          <PrivateRoute path="/user/edit" exact component={EditUser} />
          <PrivateRoute
            path="/create-profile"
            exact
            component={CreateProfile}
          />
          <PrivateRoute path="/profile" exact component={Profile} />
        </App>
      </BrowserRouter>
    );
  }
}

export default AppRouter;
