import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import renderTextField from '../common/renderTextField';
import { withStyles } from '@material-ui/core/styles';
import * as authActions from '../../actions/authActions';
import { withSnackbar } from 'notistack';
import { Typography, Button, Grid, Container } from '@material-ui/core';

const styles = theme => ({
  root: {
    textAlign: 'center',
    marginTop: '30px'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  textField: {
    width: '100%',
    margin: 'auto'
  },
  dense: {
    marginTop: 16
  },
  button: {
    marginTop: theme.spacing(2)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  radio: {
    display: 'flex',
    verticalAlign: 'middle'
  },
  radioGroups: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  fileUpload: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2)
  },
  bigAvatar: {
    width: 200,
    height: 200,
    margin: 'auto'
  }
});

class EditUser extends Component {
  onSubmit = formValues => {
    const { editUser, history, enqueueSnackbar, auth } = this.props;
    editUser(
      formValues,
      () => {
        enqueueSnackbar(`User updated`, {
          variant: 'info'
        });
        history.push(`/profile/${auth.user.id}`);
      },
      text =>
        enqueueSnackbar(text, {
          variant: 'error'
        })
    );
  };

  render() {
    const { classes, handleSubmit, pristine, submitting } = this.props;
    return (
      <Container className={classes.root}>
        <Grid container justify="center" alignItems="center">
          <Grid item xs={12} sm={10} md={8}>
            <Typography variant="h4" component="h3" color="primary">
              Edit User
            </Typography>
            <form
              className={classes.form}
              onSubmit={handleSubmit(this.onSubmit)}
            >
              <Field
                name="username"
                classes={classes}
                label="User Name"
                component={renderTextField}
              />
              <Field
                name="email"
                classes={classes}
                label="Email"
                component={renderTextField}
              />
              <Field
                type="password"
                name="password"
                classes={classes}
                label="Confirmation Password"
                component={renderTextField}
              />
              <Field
                type="password"
                name="password2"
                classes={classes}
                label="New Password"
                component={renderTextField}
                helperText="* If you dont want to change your password just leave this field blank"
              />
              <Button
                variant="outlined"
                size="medium"
                color="primary"
                className={classes.button}
                type="submit"
                disabled={pristine || submitting}
              >
                Submit
              </Button>
            </form>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  initialValues: { ...state.auth.user }
});

const validate = ({ username, email, password }) => {
  const errors = {};

  if (!email) {
    errors.email = 'Email field is required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    errors.email = 'Invalid email address';
  }
  if (!password) {
    errors.password = 'Password field is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  if (!username) {
    errors.username = 'Username field is required';
  } else if (username.length < 4 || username.length > 15) {
    errors.username = 'Username must be between 4 and 15 characters';
  }
  if (password && password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  return errors;
};

export default compose(
  connect(
    mapStateToProps,
    authActions
  ),
  reduxForm({ form: 'editUser', validate, enableReinitialize: true }),
  withStyles(styles),
  withSnackbar
)(EditUser);
