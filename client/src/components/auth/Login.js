import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';

import * as authActions from '../../actions/authActions';

import { Paper, Typography, Button, Container } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ForgotPassword from './ForgotPassword';
import renderTextField from '../common/renderTextField';
import { withSnackbar } from 'notistack';

const styles = theme => ({
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

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  onSubmit = formValues => {
    const { login, history, enqueueSnackbar } = this.props;
    return login(
      formValues,
      userId => {
        enqueueSnackbar(`Successfully loged in`, {
          variant: 'info'
        });
        history.push(`/profile/${userId}`);
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
      <Container>
        <Grid container spacing={10} justify="center" alignItems="center">
          <Grid item xs={12} sm={8} md={5} lg={4}>
            <Paper className={classes.paper} elevation={2}>
              <Typography variant="h4" component="h3" color="primary">
                LOGIN
              </Typography>
              <form
                onSubmit={handleSubmit(this.onSubmit)}
                className={classes.container}
                noValidate
                autoComplete="off"
              >
                <Field
                  name="username"
                  classes={classes}
                  label="Username"
                  component={renderTextField}
                />
                <Field
                  name="password"
                  type="password"
                  classes={classes}
                  label="Password"
                  component={renderTextField}
                />
                <Button
                  variant="outlined"
                  size="medium"
                  color="primary"
                  className={classes.button}
                  type="submit"
                  disabled={pristine || submitting}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  color="primary"
                  className={classes.button}
                  onClick={this.handleClickOpen}
                >
                  Fogot Password
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>

        <ForgotPassword
          handleClose={this.handleClose}
          open={this.state.open}
          classes={classes}
        />
      </Container>
    );
  }
}

const validate = ({ username, password }) => {
  const errors = {};

  if (!password) {
    errors.password = 'Password field is required';
  }
  if (!username) {
    errors.username = 'Username field is required';
  }
  return errors;
};

export default compose(
  connect(
    null,
    authActions
  ),
  reduxForm({ form: 'login', validate }),
  withStyles(styles),
  withSnackbar
)(Login);
