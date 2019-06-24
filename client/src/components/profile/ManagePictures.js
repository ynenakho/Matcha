import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  // DialogContentText,
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
  componentDidMount() {
    // const { id } = this.props.match.params;
  }

  onSubmit = () => {
    console.log(this.props);
  };

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
        // className={classes.root}
        fullWidth={true}
        maxWidth={'md'}
        className={classes.dialog}
      >
        <DialogTitle id="form-dialog-title">Pictures</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            Choose a picture that you wanna use as avatar
          </DialogContentText> */}
          <Grid container className={classes.mainGrid}>
            {this.renderPictures()}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
        {/* </Grid>
        </Grid> */}
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  pictures: state.profile.pictures
  // auth: state.auth
});

export default compose(
  withSnackbar,
  connect(
    mapStateToProps,
    profileActions
  ),
  withStyles(styles)
)(ManagePictures);
