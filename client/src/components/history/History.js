import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Grid, Typography, List, Button, Container } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as historyActions from '../../actions/historyActions';
import ProfileItem from '../common/ProfileItem';
import Loader from '../common/Loader';

const styles = theme => ({
  root: {
    flexGrow: 1,
    textAlign: 'center',
    marginTop: '30px'
  },
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  arrows: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '20px'
  },
  header: {
    textAlign: 'center'
  }
});

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visitorsPage: 0,
      visitedPage: 0
    };
  }

  componentDidMount() {
    const { getVisitors, getVisited } = this.props;
    const { visitorsPage, visitedPage } = this.state;
    getVisitors(visitorsPage);
    getVisited(visitedPage);
  }

  _prevPage = (get, page) => {
    if (this.state[page] === 0) return;
    get(this.state[page] - 1);
    this.setState({
      [page]: this.state[page] - 1
    });
  };

  _nextPage = (get, page) => {
    const { visitors, visited } = this.props.visitorsHistory;
    const profiles = page === 'visitorsPage' ? visitors : visited;
    if (profiles.length < 5) return;
    get(this.state[page] + 1);
    this.setState({
      [page]: this.state[page] + 1
    });
  };

  _renderArrows = page => {
    const { visitors, visited } = this.props.visitorsHistory;
    const { getVisitors, getVisited, classes } = this.props;
    const profiles = page === 'visitorsPage' ? visitors : visited;
    return (
      <div className={classes.arrows}>
        <Button
          disabled={!this.state[page]}
          variant="outlined"
          size="small"
          color="primary"
          onClick={() =>
            this._prevPage(
              page === 'visitorsPage' ? getVisitors : getVisited,
              page
            )
          }
        >
          Prev
        </Button>
        <span className={classes.pageNumber}>{this.state[page] + 1}</span>
        <Button
          disabled={profiles.length < 5}
          variant="outlined"
          size="small"
          color="primary"
          onClick={() =>
            this._nextPage(
              page === 'visitorsPage' ? getVisitors : getVisited,
              page
            )
          }
        >
          Next
        </Button>
      </div>
    );
  };

  _renderList = profiles => {
    return profiles.map(profile => (
      <ProfileItem
        key={profile._id + profile.visitedAt}
        profile={profile}
        saveToHistory={this.props.saveToHistory}
        auth={this.props.auth}
        history={this.props.history}
        socket={this.props.socket}
      />
    ));
  };

  render() {
    const { visitors, visited, loading } = this.props.visitorsHistory;
    const { classes } = this.props;
    if (loading) {
      return <Loader />;
    }
    return (
      <Container>
        <Grid container justify="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              component="h3"
              color="primary"
              className={classes.header}
            >
              You visited:
            </Typography>
            <List className={classes.list}>{this._renderList(visited)}</List>
            {this._renderArrows('visitedPage')}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              component="h3"
              color="primary"
              className={classes.header}
            >
              Your visitors:
            </Typography>
            <List className={classes.list}>{this._renderList(visitors)}</List>
            {this._renderArrows('visitorsPage')}
          </Grid>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  visitorsHistory: state.history,
  auth: state.auth,
  socket: state.socket.socket
});

export default compose(
  connect(
    mapStateToProps,
    historyActions
  ),
  withStyles(styles)
)(History);
