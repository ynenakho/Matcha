import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as profileActions from '../../actions/profileActions';
import ManagePictures from './ManagePictures';
import {
  Grid,
  Avatar,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Container
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import moment from 'moment';
import _ from 'lodash';
import Loader from '../common/Loader';

const styles = theme => ({
  root: {
    textAlign: 'center',
    marginTop: '30px'
  },
  bigAvatar: {
    marginTop: '20px',
    marginBottom: '20px',
    margin: 'auto',
    width: 200,
    height: 200
  },
  listItems: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  button: {
    margin: theme.spacing(2)
  }
});

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  _renderInfo = () => {
    const {
      profile: { profile },
      classes
    } = this.props;
    if (profile.invisible) {
      return (
        <Typography variant="h4" component="h3" color="primary">
          User Blocked You
          <br />
          Sorry...
        </Typography>
      );
    }
    return (
      <React.Fragment>
        <Button
          onClick={this.handleOpenModal}
          variant="contained"
          className={classes.button}
        >
          Pictures
        </Button>
        {this.renderListItem(
          'First Name:',
          profile.connected
            ? `${profile.firstName} (connected)`
            : profile.blocked
            ? `${profile.firstName} (blocked)`
            : profile.firstName
        )}
        <Divider />
        {this.renderListItem('Last Name:', profile.lastName)}
        <Divider />
        {this.renderListItem(
          'Age:',
          profile.birthDate
            ? moment().diff(moment(new Date(profile.birthDate)), 'years')
            : ''
        )}
        <Divider />
        {this.renderListItem('Gender:', profile.gender)}
        <Divider />
        {this.renderListItem('Sex Preferences:', profile.sexPref)}
        <Divider />
        {this.renderListItem('Bio:', profile.bio)}
        <Divider />
        {this.renderListItem(
          'Interests',
          profile.interests ? profile.interests.join(', ') : ''
        )}
        <Divider />
        {this.renderListItem('Rating:', profile.rating)}
        {this._renderButtons()}
      </React.Fragment>
    );
  };

  _fetchData = () => {
    const { id } = this.props.match.params;
    const { auth } = this.props;
    if (_.isEmpty(auth.profile)) {
      this.props.history.push({
        pathname: '/create-profile',
        state: {
          componentName: 'Create'
        }
      });
    } else {
      this.props.getProfile(id);
      this.props.getPicture(id);
      this.props.getAllPictures(id);
    }
  };

  _blockUser = () => {
    const { blockUser, match } = this.props;
    blockUser(match.params.id);
  };

  _disconnectUser = () => {
    const { disconnectUser, match } = this.props;
    disconnectUser(match.params.id);
  };

  componentDidMount() {
    this._fetchData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this._fetchData();
    }
  }

  handleOpenModal = () => {
    this.setState({ open: true });
  };

  handleCloseModal = () => {
    this.setState({ open: false });
  };

  renderListItem = (text, value) => {
    return (
      <List>
        <ListItem>
          <ListItemText style={{ width: '40%' }} primary={text} />
          <ListItemText style={{ width: '60%' }} primary={value} />
        </ListItem>
      </List>
    );
  };

  _renderButtons = () => {
    const { classes, match, auth, profile } = this.props;
    if (auth.user && match.params.id === auth.user.id) {
      return (
        <React.Fragment>
          <Button
            variant="outlined"
            size="medium"
            color="primary"
            className={classes.button}
            component={Link}
            to={{
              pathname: '/create-profile',
              state: {
                componentName: 'Edit'
              }
            }}
          >
            Edit Profile
          </Button>
          <Button
            variant="outlined"
            size="medium"
            color="primary"
            className={classes.button}
            component={Link}
            to="/user/edit"
          >
            Edit User
          </Button>
          <Button
            variant="outlined"
            size="medium"
            color="primary"
            className={classes.button}
            component={Link}
            to="/history"
          >
            History
          </Button>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <Button
          variant="outlined"
          size="medium"
          color="primary"
          className={classes.button}
          onClick={this._blockUser}
        >
          {profile.profile.blocked ? 'Unblock User' : 'Block User'}
        </Button>
        <Button
          variant="outlined"
          size="medium"
          color="primary"
          className={classes.button}
          onClick={this._disconnectUser}
          disabled={!profile.profile.connected || profile.profile.blocked}
        >
          Disconnect
        </Button>
        <Button
          variant="outlined"
          size="medium"
          color="primary"
          className={classes.button}
          component={Link}
          to={`/chat/${match.params.id}`}
          disabled={!profile.profile.connected || profile.profile.blocked}
        >
          Message
        </Button>
      </React.Fragment>
    );
  };

  render() {
    const { profile, picture, classes, match, socket } = this.props;
    if (profile.loading) {
      return <Loader />;
    } else {
      return (
        <Container className={classes.root}>
          <Grid container justify="center" alignItems="center">
            <Grid item xs={12} sm={10} md={8}>
              <Typography variant="h4" component="h3" color="primary">
                Profile
              </Typography>
              {!_.isEmpty(picture) ? (
                <Avatar
                  alt="/img/picture-default.jpg"
                  src={picture.path}
                  className={classes.bigAvatar}
                />
              ) : (
                <Avatar
                  alt=""
                  src="/img/picture-default.jpg"
                  className={classes.bigAvatar}
                />
              )}

              {this._renderInfo()}
            </Grid>
          </Grid>
          <ManagePictures
            handleCloseModal={this.handleCloseModal}
            open={this.state.open}
            userId={match.params.id}
            blocked={profile.profile.blocked}
            socket={socket}
          />
        </Container>
      );
    }
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  picture: state.profile.picture,
  socket: state.socket.socket
});

export default compose(
  connect(
    mapStateToProps,
    profileActions
  ),
  withStyles(styles)
)(Profile);
