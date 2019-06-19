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
  Button,
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
import _ from 'lodash';

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
  },
  button: {
    margin: theme.spacing(2)
    // width: '60%'
  },
  arrows: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '20px'
  },
  pageNumber: {
    // margin: '0px 20px 0px 20px'
  }
});

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0
    };
  }

  componentDidMount() {
    const { getProfile, auth, profile, profiles } = this.props;
    // if (auth.user) {
    //   const currentProfile = await getProfile(auth.user.id);
    // if (_.isEmpty(currentProfile)) {
    if (_.isEmpty(auth.profile)) {
      this.props.history.push({
        pathname: '/create-profile',
        state: {
          componentName: 'Create'
        }
      });
    }
    if (
      _.isEmpty(profiles.profiles)
      // profile._userId &&
      // profile._userId === auth.user.id
    ) {
      console.log('In did mount');
      this._getProfiles();
    }
  }

  // async componentDidUpdate(prevProps) {
  //   const { getProfile, auth, profile, profiles } = this.props;
  //   if (prevProps.auth.user !== auth.user) {
  //     const currentProfile = await getProfile(auth.user.id);
  //     if (_.isEmpty(currentProfile)) {
  //       this.props.history.push({
  //         pathname: '/create-profile',
  //         state: {
  //           componentName: 'Create'
  //         }
  //       });
  //     }
  //   }
  //   if (
  //     _.isEmpty(profiles.profiles) &&
  //     prevProps.profile !== profile &&
  //     profile._userId === auth.user.id
  //   ) {
  //     console.log('In did update');
  //     this._getProfiles();
  //   }
  // }

  _getProfiles = () => {
    const { getProfiles, auth } = this.props;
    if (!auth.profile.sexPref) {
      console.log(auth.profile.sexPref);

      getProfiles('bisexual');
    } else {
      console.log('2', auth.profile.sexPref);
      getProfiles(auth.profile.sexPref);
    }
  };

  _getBlockedProfiles = () => {
    const { getBlockedProfiles } = this.props;
    getBlockedProfiles();
  };

  _searchProfiles = values => {
    const { searchProfiles } = this.props;
    console.log('Search by age', values);
    searchProfiles(values);
  };

  _sortProfiles = sort => {
    const { sortProfiles, profiles, profile } = this.props;
    console.log(
      'Sort By',
      sort,
      new Date(profiles.profiles[0].birthDate).getTime()
    );
    sortProfiles(profiles.profiles, profile, sort);
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

  _changePage = page => {
    const { profiles } = this.props.profiles;
    return profiles.slice(5 * page, 5 * page + 5);
  };

  _prevPage = () => {
    const { page } = this.state;
    if (page === 0) return;
    this._changePage(page - 1);
    this.setState({
      page: page - 1
    });
  };

  _nextPage = () => {
    const { profiles } = this.props;
    const { page } = this.state;
    if (profiles.length < 5) return;
    this._changePage(page + 1);
    this.setState({
      page: page + 1
    });
  };

  _renderArrows = () => {
    const { page } = this.state;
    const { profiles, classes } = this.props;
    return (
      <div className={classes.arrows}>
        <Button
          disabled={!this.state.page}
          variant="outlined"
          size="small"
          color="primary"
          onClick={this._prevPage}
        >
          Prev
        </Button>
        <span className={classes.pageNumber}>{this.state.page + 1}</span>
        <Button
          disabled={profiles.profiles.length <= 5 * (page + 1)}
          variant="outlined"
          size="small"
          color="primary"
          onClick={this._nextPage}
        >
          Next
        </Button>
      </div>
    );
  };

  render() {
    const { classes, profiles, auth } = this.props;
    if (profiles.loading || auth.loading) {
      return <div>Loading...</div>;
    } else {
      const profilesToRender = this._changePage(this.state.page);
      return (
        <div className={classes.root}>
          <Grid container justify="center">
            <Grid item xs={12} sm={10} md={8}>
              <Typography variant="h4" component="h3" color="primary">
                Search
              </Typography>
              <SearchBar searchProfiles={this._searchProfiles} />
              <SortBar sortProfiles={this._sortProfiles} />
              <Button
                variant="outlined"
                size="medium"
                color="primary"
                className={classes.button}
                onClick={this._getProfiles}
              >
                Find Not Blocked Users
              </Button>
              <Button
                variant="outlined"
                size="medium"
                color="primary"
                className={classes.button}
                onClick={this._getBlockedProfiles}
              >
                Find Blocked Users
              </Button>
              <List className={classes.list}>
                {this._renderSearchItems(profilesToRender)}
              </List>
              {this._renderArrows()}
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
