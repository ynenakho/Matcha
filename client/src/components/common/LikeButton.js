import React from 'react';
import classnames from 'classnames';
import { IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import LikeIcon from '@material-ui/icons/ThumbUp';

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

const findUserLike = (auth, likes) => {
  return auth.user &&
    likes.filter(like => like._userId === auth.user.id).length > 0
    ? true
    : false;
};

const LikeButton = ({ likePicture, auth, picture, classes }) => {
  return (
    <IconButton onClick={() => likePicture(picture._id, picture._userId)}>
      <LikeIcon
        className={classnames({
          [`${classes.button}`]: findUserLike(auth, picture.likes)
        })}
      />
      {picture.likes.length}
    </IconButton>
  );
};

export default withStyles(styles)(LikeButton);
