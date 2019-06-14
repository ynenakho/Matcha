import React, { Component } from 'react';
import {
  Avatar,
  Typography,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';

const styles = theme => ({
  inline: {
    display: 'inline'
  },
  bigAvatar: {
    width: 100,
    height: 100
  },
  listItem: {
    '&:hover': {
      background: blue[50]
    },
    cursor: 'pointer'
  }
});

class ProfileItem extends Component {
  _openProfile = id => {
    const { history, auth, saveToHistory } = this.props;
    if (id !== auth.user.id) {
      saveToHistory(id);
      console.log('visited');
    }
    history.push(`/profile/${id}`);
    console.log('Open profile', id);
  };

  render() {
    const { classes, profile, auth } = this.props;
    return (
      <React.Fragment>
        <ListItem
          onClick={() => this._openProfile(profile._userId)}
          className={classes.listItem}
        >
          <ListItemAvatar>
            <Avatar
              alt="/img/picture-default.jpg"
              src={profile.picture}
              className={classes.bigAvatar}
            />
          </ListItemAvatar>
          <ListItemText
            primary={`${profile.firstName ? profile.firstName : 'unknown'} ${
              profile.lastName ? profile.lastName : 'unknown'
            }`}
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  Age:
                </Typography>
                {` ${
                  profile.birthDate
                    ? moment().diff(
                        moment(new Date(profile.birthDate)),
                        'years'
                      )
                    : 'unknown'
                }`}
                <br />
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  Interested in:
                </Typography>
                {` ${profile.sexPref ? profile.sexPref : 'unknown'}`}
                <br />
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  Location:
                </Typography>
                {` ${profile.location ? profile.location : 'unknown'}`}
                <br />
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  Status:
                </Typography>
                {` ${profile.lastVisit ? profile.lastVisit : 'unknown'}`}
              </React.Fragment>
            }
          />
          {profile.visitedAt
            ? `Visited at:
             ${moment(new Date(profile.visitedAt)).format(
               'hh:mm a MM/DD/YYYY'
             )}`
            : null}
          {profile._userId === auth.user.id ? 'This is your profile' : null}
        </ListItem>
        <Divider variant="inset" component="li" />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ProfileItem);
