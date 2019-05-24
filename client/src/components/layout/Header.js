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
  ListItemText
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  toolbarButtons: {
    marginLeft: 'auto',
    marginRight: -12
  },
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  }
};

export class Header extends Component {
  state = {
    drawerOpen: false
  };

  toggleDrawer = value => () => {
    this.setState({
      drawerOpen: value
    });
  };

  sideList = () => {
    const { classes } = this.props;
    return (
      <div className={classes.list}>
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </div>
    );
  };

  renderButtons = () => {
    const { auth, logout } = this.props;
    if (auth) {
      return (
        <React.Fragment>
          <Button component={Link} to="/profile" color="inherit">
            Profile
          </Button>
          <Button onClick={() => logout()} color="inherit">
            Logout
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
            <Button component={Link} to="/" color="inherit">
              <Typography variant="h6" color="inherit">
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
  auth: state.auth.authenticated
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    authActions
  )
)(Header);
