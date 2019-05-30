import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import renderTextField from '../common/renderTextField';
import { withStyles } from '@material-ui/core/styles';
import * as profileActions from '../../actions/profileActions';
import ManagePictures from './ManagePictures';
import { withSnackbar } from 'notistack';
import {
  // Paper,
  Typography,
  Button,
  // FormControl,
  // InputLabel,
  // Select,
  // OutlinedInput,
  // MenuItem,
  RadioGroup,
  Radio,
  // FormLabel,
  Grid,
  FormControlLabel,
  Avatar
} from '@material-ui/core';

const styles = theme => ({
  root: {
    flexGrow: 1,
    textAlign: 'center',
    paddingTop: '30px'
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

const renderRadioGroup = ({ classes, input, label, ...rest }) => (
  <div className={classes.radio}>
    <p>{label}:</p>
    <RadioGroup
      {...input}
      {...rest}
      valueselected={input.value}
      onChange={(event, value) => input.onChange(value)}
    />
  </div>
);

export class CreateProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pic64base: '',
      file: null,
      open: false
    };
  }

  componentDidMount() {
    const { profile, user } = this.props;
    if (Object.keys(profile).length === 0 && user) {
      this.props.getProfile(user.id);
      this.props.getPicture(user.id);
    }
  }

  handleOpenModal = () => {
    this.setState({ open: true });
  };

  handleCloseModal = () => {
    this.setState({ open: false });
  };

  onSubmit = formValues => {
    const { history, enqueueSnackbar, createProfile, user } = this.props;
    createProfile(
      formValues,
      () => {
        enqueueSnackbar(`Profile updated`, {
          variant: 'info'
        });
        history.push(`/profile/${user.id}`);
      },
      text =>
        enqueueSnackbar(text, {
          variant: 'error'
        })
    );
  };

  uploadPicture = () => {
    const { enqueueSnackbar, uploadPicture } = this.props;
    uploadPicture(
      this.state.file,
      () => {
        enqueueSnackbar(`Picture uploaded`, {
          variant: 'info'
        });
      },
      text =>
        enqueueSnackbar(text, {
          variant: 'error'
        })
    );

    this.setState({ file: null, pic64base: '' });
  };

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      classes,
      picture,
      profile
      // pictureFile
    } = this.props;
    let componentName;
    if (this.props.location.state)
      componentName = this.props.location.state.componentName;
    if (profile.loading) {
      return <div>Loading...</div>;
    }
    return (
      <div className={classes.root}>
        <Grid container spacing={24} justify="center" alignItems="center">
          <Grid item xs={12} sm={10} md={6} lg={4}>
            <Typography variant="h4" component="h3" color="primary">
              {typeof componentName !== 'undefined'
                ? componentName + ' Profile'
                : 'Edit Profile'}
            </Typography>
            {picture && Object.keys(picture).length > 0 ? (
              <Avatar
                alt="/img/picture-default.jpg"
                src={picture.path}
                className={classes.bigAvatar}
              />
            ) : (
              <Avatar
                alt=""
                src="/img/picture-default.jpg"
                className={classes.bigAvatar}
              />
            )}
            <Button
              onClick={this.handleOpenModal}
              variant="contained"
              className={classes.button}
            >
              Manage Pictures
            </Button>
            <form
              className={classes.form}
              onSubmit={handleSubmit(this.onSubmit)}
            >
              <Field
                name="firstName"
                classes={classes}
                label="First Name"
                component={renderTextField}
              />
              <Field
                name="lastName"
                classes={classes}
                label="Last Name"
                component={renderTextField}
              />
              <input
                type="file"
                id="raised-button-file"
                style={{ display: 'none' }}
                onChange={e => {
                  if (e.target.files.length) {
                    const data = new FormData();
                    data.append('file', e.target.files[0]);
                    var reader = new FileReader();
                    reader.readAsDataURL(e.target.files[0]);
                    reader.onloadend = () => {
                      this.setState({
                        pic64base: reader.result,
                        file: data
                      });
                    };
                  }
                }}
              />

              <label
                htmlFor="raised-button-file"
                className={classes.fileUpload}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Button variant="contained" component="span">
                    Select Picture
                  </Button>
                  <Button
                    onClick={() => this.uploadPicture()}
                    variant="contained"
                    className={classes.button}
                    disabled={!this.state.file}
                  >
                    Upload Picture
                  </Button>
                </div>
                <div>
                  <img src={this.state.pic64base} alt="" width="200px" />
                </div>
              </label>

              <div className={classes.radioGroups}>
                <Field
                  name="gender"
                  component={renderRadioGroup}
                  label="Gender"
                  classes={classes}
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value="bisexual"
                    control={<Radio />}
                    label="Bisexual"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value="gay"
                    control={<Radio />}
                    label="Gay"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value="lesbian"
                    control={<Radio />}
                    label="Lesbian"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value="transgender"
                    control={<Radio />}
                    label="Transgender"
                    labelPlacement="start"
                  />
                </Field>
                <Field
                  classes={classes}
                  name="sexPref"
                  component={renderRadioGroup}
                  label="Sex Preferences"
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value="bisexual"
                    control={<Radio />}
                    label="Both"
                    labelPlacement="start"
                  />
                </Field>
              </div>
              <Field
                name="bio"
                classes={classes}
                label="About You"
                component={renderTextField}
                multiline
                rowsMax="4"
              />
              <Field
                name="location"
                classes={classes}
                label="Your Location"
                component={renderTextField}
              />
              <Field
                name="interests"
                classes={classes}
                label="Interests"
                component={renderTextField}
                multiline
                rowsMax="4"
                helperText="* intersts should be separated by comma"
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
        <ManagePictures
          handleCloseModal={this.handleCloseModal}
          open={this.state.open}
          // classes={classes}
        />
      </div>
    );
  }
}
// const selector = formValueSelector('createProfile');

const mapStateToProps = state => ({
  // pictureFile: selector(state, 'picture'),
  picture: state.profile.picture,
  profile: state.profile.profile,
  initialValues: {
    ...state.profile.profile,
    interests: state.profile.profile.interests
      ? state.profile.profile.interests.join(', ')
      : ''
  },
  user: state.auth.user
});

const validate = () => {
  const errors = {};

  return errors;
};

export default compose(
  connect(
    mapStateToProps,
    profileActions
  ),
  reduxForm({ form: 'createProfile', validate, enableReinitialize: true }),
  withStyles(styles),
  withSnackbar
)(CreateProfile);
