import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import renderTextField from '../common/renderTextField';
import { withStyles } from '@material-ui/core/styles';
// import * as profileActions from '../../actions/profileActions';
import * as authActions from '../../actions/authActions';
import { withSnackbar } from 'notistack';
import {
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  RadioGroup,
  Radio,
  FormLabel,
  Grid,
  FormControlLabel,
  Avatar
} from '@material-ui/core';

const styles = theme => ({
  root: {
    flexGrow: 1,
    textAlign: 'center',
    marginTop: '30px'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  form: {
    // display: 'flex',
    // flexDirection: 'column'
  },
  textField: {
    width: '100%',
    margin: 'auto'
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  button: {
    marginTop: theme.spacing.unit * 2
    // width: '60%'
  },
  formControl: {
    margin: theme.spacing.unit,
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
    marginTop: theme.spacing.unit * 2
    // float: 'right'
  },
  bigAvatar: {
    width: 200,
    height: 200,
    margin: 'auto'
  }
});

class EditUser extends Component {
  componentWillMount() {
    const { history, user } = this.props;
    if (!user || !Object.keys(user).length) {
      history.push('/profile');
    }
  }

  onSubmit = formValues => {
    const { editUser, history, enqueueSnackbar } = this.props;
    console.log(formValues);
    editUser(
      formValues,
      () => {
        enqueueSnackbar(`User updated`, {
          variant: 'info'
        });
        history.push('/profile');
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
      <div className={classes.root}>
        <Grid container spacing={24} justify="center" alignItems="center">
          <Grid item xs={12} sm={10} md={6} lg={4}>
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  // pictureFile: selector(state, 'picture'),

  user: state.auth.user,
  initialValues: { ...state.auth.user }
  // auth: state.auth
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
  reduxForm({ form: 'editUser', validate }),
  withStyles(styles),
  withSnackbar
)(EditUser);
