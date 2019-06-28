import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Landing from './components/landing/Landing';
import App from './App';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import PrivateRoute from './components/common/PrivateRoute';
import NotFound from './components/common/NotFound';
import Profile from './components/profile/Profile';
import CreateProfile from './components/profile/CreateProfile';
import EditUser from './components/profile/EditUser';
import Search from './components/search/Search';
import History from './components/history/History';
import Chat from './components/messaging/Chat';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';

export class AppRouter extends Component {
  render() {
    return (
      <BrowserRouter>
        <App>
          <Header />
          <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/login" exact component={Login} />
            <Route path="/signup" exact component={SignUp} />
            <PrivateRoute path="/user/edit" exact component={EditUser} />
            <PrivateRoute path="/history" exact component={History} />
            <PrivateRoute path="/search" exact component={Search} />
            <PrivateRoute path="/chat/:id" exact component={Chat} />
            <PrivateRoute
              path="/create-profile"
              exact
              component={CreateProfile}
            />
            <PrivateRoute path="/profile/:id" exact component={Profile} />
            <Route component={NotFound} />
          </Switch>
          <Footer />
        </App>
      </BrowserRouter>
    );
  }
}

export default AppRouter;
