import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import * as profileActions from '../../actions/profileActions';
// import {
//   Grid,
//   Avatar,
//   Typography,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   Divider
// } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';

const styles = theme => ({
  root: {
    flexGrow: 1
  }
});

class Search extends Component {
  // componentDidUpdate(prevProps) {
  //   const { getProfile, user } = this.props;
  //   if (prevProps.user !== user) {
  //     getProfile(user.id);
  //   }
  // }

  render() {
    // const { profile, user, auth } = this.props;
    // if (profile.loading || auth.loading) {
    //   return <div>Loading...</div>;
    // } else if (
    //   Object.keys(profile).length === 0 &&
    //   user &&
    //   Object.keys(user).length !== 0
    // ) {
    //   return (
    //     <div>
    //       <p>Welcome {user.name}</p>
    //       <p>You have not yet setup a profile, please add some info</p>
    //       <Button
    //         component={Link}
    //         to={{
    //           pathname: '/create-profile',
    //           state: {
    //             componentName: 'Create'
    //           }
    //         }}
    //       >
    //         Create Profile
    //       </Button>
    //     </div>
    //   );
    // }
    return (
      <div>
        <h1>Search</h1>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  // auth: state.auth,
  // user: state.auth.user,
  // profile: state.profile.profile,
  // picture: state.profile.picture
});

export default compose(
  connect(
    mapStateToProps,
    profileActions
  ),
  withStyles(styles)
)(Search);
