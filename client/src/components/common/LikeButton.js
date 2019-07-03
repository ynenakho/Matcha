import React from 'react';
import classnames from 'classnames';
import { IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import LikeIcon from '@material-ui/icons/ThumbUp';
// import { socket } from '../../actions/authActions';
import { LIKE } from '../common/events';

const styles = theme => ({
  button: {
    color: blue[500]
  }
});

const findUserLike = (user, likes) => {
  return likes.filter(like => like.likedBy === user.id).length > 0
    ? true
    : false;
};

const LikeButton = ({
  likePicture,
  auth,
  picture,
  classes,
  blocked,
  socket
}) => {
  return (
    <IconButton
      onClick={() => {
        if (!findUserLike(auth.user, picture.likes)) {
          const userName =
            auth.profile.firstName && auth.profile.lastName
              ? auth.profile.firstName + ' ' + auth.profile.lastName
              : auth.profile.firstName
              ? auth.profile.firstName
              : auth.profile.lastName
              ? auth.profile.lastName
              : auth.user.username;
          socket.emit(LIKE, { userId: picture._userId, userName });
        }
        likePicture(picture._id, picture._userId);
      }}
      disabled={blocked}
    >
      <LikeIcon
        className={classnames({
          [`${classes.button}`]: findUserLike(auth.user, picture.likes)
        })}
      />
      {picture.likes.length}
    </IconButton>
  );
};

export default withStyles(styles)(LikeButton);
