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
  Typography,
  Button,
  RadioGroup,
  Radio,
  Grid,
  FormControlLabel,
  Avatar,
  Container
} from '@material-ui/core';
import publicIp from 'public-ip';

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

const renderRadioGroup = ({ classes, input, label, ...rest }) => (
  <div className={classes.radio}>
    <p>{label}:</p>
    <RadioGroup
      valueselected={input.value}
      onChange={(event, value) => input.onChange(value)}
      {...input}
      {...rest}
    />
  </div>
);

export class CreateProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pic64base: '',
      file: null,
      open: false,
      position: null,
      ip: null
    };
  }

  async componentDidMount() {
    const { profile, user, getPicture, getAllPictures } = this.props;
    getPicture(user.id);
    getAllPictures(user.id);
    // GETTING PERMITION FOR GEOLOCATION
    if (!profile.location) {
      window.navigator.geolocation.getCurrentPosition(position =>
        this.setState({
          position: {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          }
        })
      );
    }
    publicIp.v4().then(result => this.setState({ ip: result }));
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
        }),
      !formValues.location ? this.state.position : null,
      !formValues.location && !this.state.position ? this.state.ip : null
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
      location
    } = this.props;
    let componentName;
    if (location.state) componentName = location.state.componentName;
    return (
      <Container className={classes.root}>
        <Grid container justify="center" alignItems="center">
          <Grid item xs={12} sm={10} md={8}>
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
              <Field
                name="birthDate"
                label="Birthday"
                type="date"
                component={renderTextField}
                classes={classes}
                InputLabelProps={{
                  shrink: true
                }}
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
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  picture: state.profile.picture,
  profile: state.auth.profile,
  initialValues: {
    ...state.auth.profile,
    interests: state.auth.profile.interests
      ? state.auth.profile.interests.join(', ')
      : '',
    birthDate: state.auth.profile.birthDate
      ? state.auth.profile.birthDate.slice(0, 10)
      : null
  },
  user: state.auth.user
});

const validate = ({ firstName, birthDate }) => {
  const errors = {};
  if (!firstName) {
    errors.firstName = 'First name field is required';
  }
  if (!birthDate) {
    errors.birthDate = 'Birth date field is required';
  }
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
