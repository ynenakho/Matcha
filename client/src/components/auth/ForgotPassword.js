import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from '@material-ui/core';
import { compose } from 'redux';
import { connect } from 'react-redux';

import * as authActions from '../../actions/authActions';

import renderTextField from '../common/renderTextField';
import { reduxForm, Field } from 'redux-form';
import { withSnackbar } from 'notistack';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class ForgotPassword extends React.Component {
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

  render() {
    const { handleSubmit, pristine, submitting, classes } = this.props;
    return (
      <Dialog
        TransitionComponent={Transition}
        keepMounted
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Forgot password?</DialogTitle>
        <form
          onSubmit={handleSubmit(this.onSubmit)}
          noValidate
          autoComplete="off"
        >
          <DialogContent>
            <DialogContentText>
              Enter your email and we will send you new password.
            </DialogContentText>

            <Field
              name="email"
              classes={classes}
              label="Email"
              component={renderTextField}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.handleClose} color="primary">
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              disabled={pristine || submitting}
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

const validate = ({ email }) => {
  const errors = {};

  if (!email) {
    errors.email = 'Email field is required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    errors.email = 'Invalid email address';
  }
  return errors;
};

export default compose(
  reduxForm({ form: 'forgotpassword', validate }),
  withSnackbar,
  connect(
    null,
    authActions
  )
)(ForgotPassword);
