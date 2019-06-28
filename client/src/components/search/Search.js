import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as profilesActions from '../../actions/profilesActions';
import * as profileActions from '../../actions/profileActions';
import * as historyActions from '../../actions/historyActions';
import { Grid, Typography, Button, List } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import ProfileItem from '../common/ProfileItem';
import SearchBar from './SearchBar';
import SortBar from './SortBar';
import _ from 'lodash';
import Loader from '../common/Loader';

const styles = theme => ({
  root: {
    textAlign: 'center',
    marginTop: '30px'
  },
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  button: {
    margin: theme.spacing(2)
  },
  arrows: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '20px'
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
    const { auth, profiles } = this.props;
    if (_.isEmpty(auth.profile)) {
      this.props.history.push({
        pathname: '/create-profile',
        state: {
          componentName: 'Create'
        }
      });
    } else if (_.isEmpty(profiles.profiles)) {
      this._getProfiles(auth.profile.sexPref);
    }
  }

  _getProfiles = sexPref => {
    const { getProfiles } = this.props;
    this.setState({ page: 0 });
    if (!sexPref) {
      getProfiles('bisexual');
    } else {
      getProfiles(sexPref);
    }
  };

  _getBlockedProfiles = () => {
    const { getBlockedProfiles } = this.props;
    this.setState({ page: 0 });
    getBlockedProfiles();
  };

  _getConnectedProfiles = () => {
    const { getConnectedProfiles } = this.props;
    this.setState({ page: 0 });
    getConnectedProfiles();
  };

  _getLikedYouProfiles = () => {
    const { getLikedYouProfiles } = this.props;
    this.setState({ page: 0 });
    getLikedYouProfiles();
  };

  _searchProfiles = values => {
    const { searchProfiles } = this.props;
    this.setState({ page: 0 });
    searchProfiles(values);
  };

  _sortProfiles = sort => {
    const { sortProfiles, profiles, profile } = this.props;
    this.setState({ page: 0 });
    sortProfiles(profiles.profiles, profile, sort);
  };

  _renderSearchItems = () => {
    const { profiles, auth } = this.props;
    if (profiles.loading || auth.loading) {
      return <Loader />;
    } else {
      const profilesToRender = this._changePage(this.state.page);
      return profilesToRender.map(profile => (
        <ProfileItem
          key={profile._id}
          profile={profile}
          saveToHistory={this.props.saveToHistory}
          auth={this.props.auth}
          history={this.props.history}
          socket={this.props.socket}
        />
      ));
    }
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
    const { classes } = this.props;
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
              onClick={() => this._getProfiles()}
            >
              All Users
            </Button>
            <Button
              variant="outlined"
              size="medium"
              color="primary"
              className={classes.button}
              onClick={this._getBlockedProfiles}
            >
              Blocked Users
            </Button>
            <Button
              variant="outlined"
              size="medium"
              color="primary"
              className={classes.button}
              onClick={this._getConnectedProfiles}
            >
              Connected Users
            </Button>
            <Button
              variant="outlined"
              size="medium"
              color="primary"
              className={classes.button}
              onClick={this._getLikedYouProfiles}
            >
              Liked You
            </Button>
            <List className={classes.list}>{this._renderSearchItems()}</List>
            {this._renderArrows()}
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  profiles: state.profiles,
  profile: state.auth.profile,
  socket: state.socket.socket
});

export default compose(
  connect(
    mapStateToProps,
    { ...profilesActions, ...historyActions, ...profileActions }
  ),
  withStyles(styles)
)(Search);
