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
  Divider
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import moment from 'moment';

const styles = theme => ({
  root: {
    flexGrow: 1,
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
    margin: theme.spacing.unit * 2
    // width: '60%'
  }
});

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  _fetchData = () => {
    const { id } = this.props.match.params;
    this.props.getProfile(id);
    this.props.getPicture(id);
    this.props.getAllPictures(id);
  };

  componentDidMount() {
    // NEED TO MAKE MAKE ONE CALL INSTEAD OF TWO TO FIX BUF WITH RENDERING NO PROFILE FOR A SECOND
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
    // const { classes } = this.props;
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
    const { classes, match, auth } = this.props;
    if (match.params.id === auth.user.id) {
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
        </React.Fragment>
      );
    }
    return null;
  };

  render() {
    // const { user } = this.props.auth;
    const { profile, picture, classes, auth, match } = this.props;
    if (profile.loading || auth.loading) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className={classes.root}>
          <Grid container spacing={24} justify="center" alignItems="center">
            <Grid item xs={12} sm={10} md={6} lg={4}>
              <Typography variant="h4" component="h3" color="primary">
                Profile
              </Typography>

              {picture && Object.keys(picture).length > 0 ? (
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
              <Button
                onClick={this.handleOpenModal}
                variant="contained"
                className={classes.button}
              >
                Pictures
              </Button>
              {/* {this.renderListItem('User Name:', auth.user.username)}
              <Divider /> */}
              {this.renderListItem('First Name:', profile.firstName)}
              <Divider />
              {this.renderListItem('Last Name:', profile.lastName)}
              <Divider />
              {this.renderListItem(
                'Age:',
                moment().diff(
                  moment(new Date(profile.birthDate).toISOString()),
                  'years',
                  true
                )
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
            </Grid>
          </Grid>
          <ManagePictures
            handleCloseModal={this.handleCloseModal}
            open={this.state.open}
            userId={match.params.id}
            // classes={classes}
          />
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile.profile,
  picture: state.profile.picture
});

export default compose(
  connect(
    mapStateToProps,
    profileActions
  ),
  withStyles(styles)
)(Profile);
