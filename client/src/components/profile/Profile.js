import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as profileActions from '../../actions/profileActions';
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
  componentDidMount() {
    this.props.getProfile();
    this.props.getPicture();
  }
  renderListItem = (text, value) => {
    const { classes } = this.props;
    return (
      <List>
        <ListItem>
          <ListItemText style={{ width: '40%' }} primary={text} />
          <ListItemText style={{ width: '60%' }} primary={value} />
        </ListItem>
      </List>
    );
  };

  render() {
    const { user } = this.props.auth;
    const { loading, profile, picture, classes, auth } = this.props;
    if (loading || !profile || !user) {
      return <div>Loading...</div>;
    }
    if (Object.keys(profile).length === 0 && Object.keys(user).length !== 0) {
      return (
        <div>
          <p>Welcome {user.name}</p>
          <p>You have not yet setup a profile, please add some info</p>
          <Button
            component={Link}
            to={{
              pathname: '/create-profile',
              state: {
                componentName: 'Create'
              }
            }}
          >
            Create Profile
          </Button>
        </div>
      );
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
              {this.renderListItem('User Name:', auth.user.username)}
              <Divider />
              {this.renderListItem('First Name:', profile.firstName)}
              <Divider />
              {this.renderListItem('Last Name:', profile.lastName)}
              <Divider />
              {this.renderListItem('Gender:', profile.gender)}
              <Divider />
              {this.renderListItem('Sex Preferences:', profile.sexPref)}
              <Divider />
              {this.renderListItem('Bio:', profile.bio)}
              <Divider />
              {this.renderListItem('Interests', profile.interests.join(', '))}
              <Divider />
              {this.renderListItem('Rating:', profile.rating)}
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
            </Grid>
          </Grid>
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
