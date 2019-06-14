import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import * as profilesActions from '../../actions/profilesActions';
import * as profileActions from '../../actions/profileActions';
import * as historyActions from '../../actions/historyActions';
import {
  Grid,
  //   Avatar,
  Typography,
  //   Button,
  List
  //   ListItem,
  //   ListItemText,
  //   Divider
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import ProfileItem from '../common/ProfileItem';
import SearchBar from './SearchBar';
import SortBar from './SortBar';

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
    const { getProfiles, getProfile, auth, profile } = this.props;
    if (auth.user) {
      getProfile(auth.user.id);
    }
    if (profile._userId) {
      if (!profile.sexPref) {
        getProfiles('bisexual');
      } else {
        getProfiles(profile.sexPref);
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { getProfile, getProfiles, auth, profile } = this.props;
    if (prevProps.auth.user !== auth.user) {
      getProfile(auth.user.id);
    }
    if (prevProps.profile !== profile) {
      if (!profile.sexPref) {
        getProfiles('bisexual');
      } else {
        getProfiles(profile.sexPref);
      }
    }
  }

  _searchProfiles = values => {
    const { searchProfiles } = this.props;
    console.log('Search by age', values);
    searchProfiles(values);
  };

  _sortProfiles = sortValues => {
    const { sortProfiles, profiles } = this.props;
    console.log('Sort By', sortValues);
  };

  _renderSearchItems = profiles => {
    return profiles.map(profile => (
      <ProfileItem
        key={profile._id}
        profile={profile}
        saveToHistory={this.props.saveToHistory}
        auth={this.props.auth}
        history={this.props.history}
      />
    ));
  };

  render() {
    const { classes, profiles, auth } = this.props;
    if (profiles.loading || auth.loading) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className={classes.root}>
          <Grid container justify="center">
            <Grid item xs={12} sm={10} md={8}>
              <Typography variant="h4" component="h3" color="primary">
                Search
              </Typography>
              <SearchBar searchProfiles={this._searchProfiles} />
              <SortBar sortProfiles={this._sortProfiles} />
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
  profiles: state.profiles,
  profile: state.profile.profile
  // picture: state.profile.picture
});

export default compose(
  connect(
    mapStateToProps,
    { ...profilesActions, ...historyActions, ...profileActions }
  ),
  withStyles(styles)
)(Search);
