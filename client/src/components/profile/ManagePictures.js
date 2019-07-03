import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Grid
} from '@material-ui/core';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as profileActions from '../../actions/profileActions';

import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';

import PictureDiv from './PictureDiv';

const styles = theme => ({
  dialog: {
    textAlign: 'center'
  },
  mainGrid: {
    justifyContent: 'center'
  }
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class ManagePictures extends React.Component {
  renderPictures = () => {
    const { pictures, blocked, socket } = this.props;
    return pictures.map(picture => (
      <Grid item xs={12} sm={8} key={picture._id}>
        <PictureDiv picture={picture} blocked={blocked} socket={socket} />
      </Grid>
    ));
  };

  render() {
    const { handleCloseModal, classes } = this.props;
    return (
      <Dialog
        TransitionComponent={Transition}
        keepMounted
        open={this.props.open}
        onClose={handleCloseModal}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth={'md'}
        className={classes.dialog}
      >
        <DialogTitle id="form-dialog-title">Pictures</DialogTitle>
        <DialogContent>
          <Grid container className={classes.mainGrid}>
            {this.renderPictures()}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  pictures: state.profile.pictures
});

export default compose(
  withSnackbar,
  connect(
    mapStateToProps,
    profileActions
  ),
  withStyles(styles)
)(ManagePictures);
