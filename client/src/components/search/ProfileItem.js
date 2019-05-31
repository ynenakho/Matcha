import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  //   Grid,
  Avatar,
  Typography,
  //   Button,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';

const styles = theme => ({
  inline: {
    display: 'inline'
  }
});

class ProfileItem extends Component {
  render() {
    const { classes } = this.props;
    console.log(classes);

    return (
      <React.Fragment>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
          </ListItemAvatar>
          <ListItemText
            primary="Summer BBQ"
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  to Scott, Alex, Jennifer
                </Typography>
                {" — Wish I could come, but I'm out of town this…"}
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({});

// const mapDispatchToProps = {};

export default compose(
  connect(
    mapStateToProps
    // profilesActions
  ),
  withStyles(styles)
)(ProfileItem);
