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
import { PROFILE_CHECKED } from '../common/events';
import geodist from 'geodist';

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
  _openProfile = async id => {
    const { history, auth, saveToHistory, socket } = this.props;
    if (id !== auth.user.id) {
      const blocked = await saveToHistory(id);
      if (!blocked) {
        const userName =
          auth.profile.firstName && auth.profile.lastName
            ? auth.profile.firstName + ' ' + auth.profile.lastName
            : auth.profile.firstName
            ? auth.profile.firstName
            : auth.profile.lastName
            ? auth.profile.lastName
            : auth.user.username;
        socket.emit(PROFILE_CHECKED, {
          userId: id,
          userName
        });
      }
    }
    history.push(`/profile/${id}`);
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
                } `}
                <br />
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  Rating:
                </Typography>
                {` ${profile.rating}`}
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
          {profile._userId === auth.user.id
            ? 'This is your profile'
            : `${geodist(
                { lat: auth.profile.latitude, lon: auth.profile.longitude },
                { lat: profile.latitude, lon: profile.longitude }
              )} miles`}
        </ListItem>
        <Divider variant="inset" component="li" />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ProfileItem);
