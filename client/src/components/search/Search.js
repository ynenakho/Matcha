import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import * as profilesActions from '../../actions/profilesActions';
// import * as profileActions from '../../actions/profileActions';
import {
  Grid,
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
    flexGrow: 1,
    textAlign: 'center',
    marginTop: '30px'
  },
  list: {
    width: '100%',
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
});

class Search extends Component {
  componentDidMount() {
    const { getProfiles } = this.props;
    getProfiles();
  }

  _renderSearchItems = profiles => {
    return profiles.map(profile => (
      <ProfileItem
        key={profile._id}
        profile={profile}
        openProfile={this._openProfile}
      />
    ));
  };

  _openProfile = id => {
    const { history } = this.props;
    history.push(`/profile/${id}`);
    console.log('Open profile', id);
  };

  render() {
    const { classes, profiles, auth } = this.props;
    if (profiles.loading || auth.loading) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className={classes.root}>
          <Grid container spacing={24} justify="center">
            <Grid item xs={12} sm={10} md={8}>
              <h1>Search</h1>
              <List className={classes.list}>
                {this._renderSearchItems(profiles.profiles)}
              </List>
            </Grid>
          </Grid>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  // user: state.auth.user,
  profiles: state.profiles
  // profile: state.profile.profile
  // picture: state.profile.picture
});

export default compose(
  connect(
    mapStateToProps,
    profilesActions
  ),
  withStyles(styles)
)(Search);
