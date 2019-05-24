import React from 'react';
import classNames from 'classnames';
import { TextField } from '@material-ui/core';

const renderTextField = ({
  classes,
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
  <TextField
    // id="outlined-dense"
    label={label}
    className={classNames(classes.textField, classes.dense)}
    margin="dense"
    variant="outlined"
    error={touched && error ? true : false}
    helperText={touched && error ? error : ''}
    {...input}
    {...custom}
  />
);

export default renderTextField;
