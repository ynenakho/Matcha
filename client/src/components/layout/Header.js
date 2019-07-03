import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import * as authActions from '../../actions/authActions';

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import HistoryIcon from '@material-ui/icons/History';
import ExitAppIcon from '@material-ui/icons/ExitToApp';
import ProfileIcon from '@material-ui/icons/AccountBox';
import ForwardIcon from '@material-ui/icons/Forward';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  toolbarButtons: {
    marginLeft: 'auto',
    marginRight: -12,
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  },
  bigAvatar: {
    margin: 10,
    width: 120,
    height: 120
  },
  avatarDiv: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    [theme.breakpoints.down('xs')]: {
      marginLeft: 'auto'
    }
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  }
});

class Header extends Component {
  state = {
    drawerOpen: false
  };

  toggleDrawer = value => () => {
    this.setState({
      drawerOpen: value
    });
  };

  sideList = () => {
    const { classes, auth, logout } = this.props;
    if (auth.loading) {
      return null;
    }
    if (auth.authenticated && !auth.loading) {
      return (
        <div>
          <List className={classes.list}>
            <div className={classes.avatarDiv}>
              <Typography>{`Hello, ${auth.user.username}!`}</Typography>
              <Avatar
                alt="img/picture-default.jpg"
                src={
                  auth.picture && auth.picture.path
                    ? auth.picture.path
                    : '/img/picture-default.jpg'
                }
                className={classes.bigAvatar}
              />
            </div>
          </List>
          <Divider />
          <List className={classes.list}>
            <ListItem
              button
              key="Profile"
              component={Link}
              to={`/profile/${auth.user.id}`}
            >
              <ListItemIcon>
                <ProfileIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button key="Search" component={Link} to={`/search`}>
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="Search" />
            </ListItem>
            <ListItem button key="History" component={Link} to={`/history`}>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="History" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button key="Logout" onClick={() => logout(auth.user.id)}>
              <ListItemIcon>
                <ExitAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </div>
      );
    }
    return (
      <List className={classes.list}>
        <ListItem button key="Login" component={Link} to={`/login`}>
          <ListItemIcon>
            <ForwardIcon />
          </ListItemIcon>
          <ListItemText primary="Login" />
        </ListItem>
        <ListItem button key="Signup" component={Link} to={`/signup`}>
          <ListItemIcon>
            <ForwardIcon />
          </ListItemIcon>
          <ListItemText primary="Sign Up" />
        </ListItem>
      </List>
    );
  };

  renderButtons = () => {
    const { auth, logout, classes } = this.props;
    if (auth.authenticated && auth.user) {
      return (
        <React.Fragment>
          <Button component={Link} to={`/search`} color="inherit">
            Search
            <SearchIcon className={classes.rightIcon} />
          </Button>
          <Button
            component={Link}
            to={`/profile/${auth.user.id}`}
            color="inherit"
          >
            Profile
            <ProfileIcon className={classes.rightIcon} />
          </Button>
          <Button onClick={() => logout(auth.user.id)} color="inherit">
            <ExitAppIcon />
          </Button>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Button component={Link} to="/login" color="inherit">
            Login
          </Button>
          <Button component={Link} to="/signup" color="inherit">
            Sign Up
          </Button>
        </React.Fragment>
      );
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={this.toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Button
              component={Link}
              to="/"
              color="inherit"
              className={classes.logo}
            >
              <Typography variant="h6" color="inherit" noWrap>
                Matcha
              </Typography>
            </Button>
            <span className={classes.toolbarButtons}>
              {this.renderButtons()}
            </span>
          </Toolbar>
        </AppBar>
        <Drawer open={this.state.drawerOpen} onClose={this.toggleDrawer(false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer(false)}
            onKeyDown={this.toggleDrawer(false)}
          >
            {this.sideList()}
          </div>
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    authActions
  )
)(Header);
