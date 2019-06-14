import React, { Component } from 'react';
import {
  FormControlLabel,
  Checkbox,
  Button,
  Radio,
  RadioGroup
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'middle'
  }
});

export default function SortBar(props) {
  const classes = useStyles();
  const [selectedValue, setSelectedValue] = React.useState();

  const _handleChange = e => {
    setSelectedValue(e.target.value);
  };

  const _submitSortValues = () => {
    const { sortProfiles } = props;
    sortProfiles(selectedValue);
  };

  return (
    <div className={classes.root}>
      <h1>SortBar</h1>
      <RadioGroup
        aria-label="Gender"
        name="gender1"
        // className={classes.group}
        value={selectedValue}
        onChange={_handleChange}
        row
      >
        <FormControlLabel
          control={<Radio />}
          label="Age"
          value="age"
          // labelPlacement="top"
        />
        <FormControlLabel
          control={<Radio />}
          label="Location"
          value="location"
          // labelPlacement="top"
        />
        <FormControlLabel
          control={<Radio />}
          label="Rating"
          value="rating"
          // labelPlacement="top"
        />
        <FormControlLabel
          control={<Radio />}
          label="Common Tags"
          value="tags"
          // labelPlacement="top"
        />
      </RadioGroup>
      <Button
        variant="outlined"
        size="medium"
        color="primary"
        // className={classes.button}
        onClick={_submitSortValues}
      >
        Sort
      </Button>
    </div>
  );
}
