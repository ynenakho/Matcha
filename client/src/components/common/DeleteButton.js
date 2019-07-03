import React from 'react';
// import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
  button: {
    '&:hover': {
      color: red[500]
    }
  }
});

const DeleteButton = ({ deletePicture, pictureId, classes }) => {
  return (
    <IconButton
      onClick={() => deletePicture(pictureId)}
      className={classes.button}
    >
      <DeleteIcon />
    </IconButton>
  );
};

export default withStyles(styles)(DeleteButton);
