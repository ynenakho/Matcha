import React from 'react';
import classnames from 'classnames';
import { IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import LikeIcon from '@material-ui/icons/ThumbUp';
// import { socket } from '../../actions/authActions';
import { LIKE } from '../common/events';

const styles = theme => ({
  // root: {
  //   display: 'flex',
  //   justifyContent: 'center',
  //   alignItems: 'flex-end'
  // },
  icon: {
    // margin: theme.spacing * 2
  },
  button: {
    color: blue[500]
  }
  // iconHover: {
  //   margin: theme.spacing(2),
  //   '&:hover': {
  //     color: red[800]
  //   }
  // }
});

const findUserLike = (user, likes) => {
  // console.log()
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
        if (!findUserLike(auth.user, picture.likes))
          socket.emit(LIKE, {
            userId: picture._userId,
            userName: auth.profile.firstName + ' ' + auth.profile.lastName
          });
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
