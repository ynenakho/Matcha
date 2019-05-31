import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import * as profilesActions from '../../actions/profilesActions';
import * as profileActions from '../../actions/profileActions';
import {
  //   Grid,
  //   Avatar,
  //   Typography,
  //   Button,
  List
  //   ListItem,
  //   ListItemText,
  //   Divider
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import ProfileItem from './ProfileItem';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
});

class Search extends Component {
  componentDidUpdate(prevProps) {
    const { getProfile, auth } = this.props;
    if (prevProps.auth.user !== auth.user.id) {
      getProfile(auth.user.id);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <h1>Search</h1>
        <List className={classes.root}>
          <ProfileItem />
        </List>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  // user: state.auth.user,
  // profiles: state.profiles.profiles,
  profile: state.profile.profile
  // picture: state.profile.picture
});

export default compose(
  connect(
    mapStateToProps,
    { ...profileActions, ...profilesActions }
  ),
  withStyles(styles)
)(Search);
