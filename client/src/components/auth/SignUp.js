import React, { Component } from 'react';

import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';

import * as authActions from '../../actions/authActions';

import { Paper, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import renderTextField from '../common/renderTextField';
import { withSnackbar } from 'notistack';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
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
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  dense: {
    marginTop: 16
  },
  button: {
    marginTop: theme.spacing(2),
    width: '60%'
  }
});

export class SignUp extends Component {
  onSubmit = formValues => {
    console.log(formValues);
    const { signup, enqueueSnackbar, history } = this.props;
    return signup(
      formValues,
      () => {
        enqueueSnackbar(
          `Check your email and follow the instructions to validate your
        account`,
          {
            variant: 'info'
          }
        );
        history.push('/login');
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
      <div className={classes.root}>
        <Grid container spacing={24} justify="center" alignItems="center">
          <Grid item xs={12} sm={8} md={5} lg={4}>
            <Paper className={classes.paper} elevation={2}>
              <Typography variant="h4" component="h3" color="primary">
                SIGN UP
              </Typography>
              <form
                onSubmit={handleSubmit(this.onSubmit)}
                className={classes.container}
                noValidate
                autoComplete="off"
              >
                <Field
                  name="email"
                  classes={classes}
                  label="Email"
                  component={renderTextField}
                />
                <Field
                  name="username"
                  classes={classes}
                  label="Username"
                  component={renderTextField}
                />
                <Field
                  name="password"
                  classes={classes}
                  label="Password"
                  component={renderTextField}
                  type="password"
                />
                <Button
                  variant="outlined"
                  size="medium"
                  color="primary"
                  className={classes.button}
                  type="submit"
                  disabled={pristine || submitting}
                >
                  SignUp
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

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
  return errors;
};

export default compose(
  connect(
    null,
    authActions
  ),
  reduxForm({ form: 'signup', validate }),
  withStyles(styles),
  withSnackbar
)(SignUp);
