import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Grid, Typography, List } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as historyActions from '../../actions/historyActions';
import ProfileItem from '../common/ProfileItem';

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

class History extends Component {
  componentDidMount() {
    const { getVisitors, getVisited } = this.props;
    getVisitors();
    getVisited();
  }

  _renderList = profiles => {
    return profiles.map(profile => (
      <ProfileItem
        key={profile._id + profile.visitedAt}
        profile={profile}
        saveToHistory={this.props.saveToHistory}
        auth={this.props.auth}
        history={this.props.history}
      />
    ));
  };

  render() {
    const { visitors, visited, loading } = this.props.visitorsHistory;
    const { classes } = this.props;
    if (loading) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <Grid container spacing={24} justify="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h3" color="primary">
              You visited:
            </Typography>
            <List className={classes.list}>{this._renderList(visited)}</List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h3" color="primary">
              Your visitors:
            </Typography>
            <List className={classes.list}>{this._renderList(visitors)}</List>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  visitorsHistory: state.history,
  auth: state.auth
});

export default compose(
  connect(
    mapStateToProps,
    historyActions
  ),
  withStyles(styles)
)(History);
