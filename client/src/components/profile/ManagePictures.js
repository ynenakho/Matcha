import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Grid
} from '@material-ui/core';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as profileActions from '../../actions/profileActions';

import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    // backgroundColor: 'yellow'
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  textField: {
    width: '100%',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    width: '60%'
  }
});

const Transition = props => {
  return <Slide direction="up" {...props} />;
};

class ManagePictures extends React.Component {
  componentWillMount() {
    this.props.getAllPictures();
  }

  onSubmit = formValues => {
    console.log(formValues);
    const { forgotPassword, handleClose, enqueueSnackbar } = this.props;
    forgotPassword(
      formValues,
      () => {
        handleClose();
        enqueueSnackbar(`New password has been sent to ${formValues.email}`, {
          variant: 'success'
        });
      },
      text =>
        enqueueSnackbar(text, {
          variant: 'error'
        })
    );
  };

  renderPictures = () => {
    const { pictures } = this.props;
    return pictures.map(picture => (
      <div key={picture._id}>
        <img src={picture.path} alt="" width="200px" />
      </div>
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
      >
        <DialogTitle id="form-dialog-title">Forgot password?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose a picture that you wanna use as avatar
          </DialogContentText>
          {this.renderPictures()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Submit
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
});

export default compose(
  withSnackbar,
  connect(
    mapStateToProps,
    profileActions
  ),
  withStyles(styles)
)(ManagePictures);
