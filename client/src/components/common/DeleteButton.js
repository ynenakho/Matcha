import React from 'react';
// import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

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
    color: red[500]
  }
  // iconHover: {
  //   margin: theme.spacing(2),
  //   '&:hover': {
  //     color: red[800]
  //   }
  // }
});

const DeleteButton = ({ deletePicture, pictureId, classes }) => {
  return (
    <IconButton onClick={() => deletePicture(pictureId)}>
      <DeleteIcon />
    </IconButton>
  );
};

export default withStyles(styles)(DeleteButton);
