import React from 'react';
import { FormControlLabel, Button, Radio, RadioGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  button: {
    height: '36px',
    width: '90px'
  }
});

export default function SortBar(props) {
  const classes = useStyles();
  const [selectedValue, setSelectedValue] = React.useState('');

  const _handleChange = e => {
    setSelectedValue(e.target.value);
  };

  const _submitSortValues = () => {
    const { sortProfiles } = props;
    sortProfiles(selectedValue);
  };

  return (
    <div className={classes.root}>
      <RadioGroup
        aria-label="Gender"
        name="gender1"
        value={selectedValue}
        onChange={_handleChange}
        row
      >
        <FormControlLabel control={<Radio />} label="Age" value="age" />
        <FormControlLabel
          control={<Radio />}
          label="Location"
          value="location"
        />
        <FormControlLabel control={<Radio />} label="Rating" value="rating" />
        <FormControlLabel
          control={<Radio />}
          label="Common Tags"
          value="tags"
        />
      </RadioGroup>
      <Button
        variant="outlined"
        size="medium"
        color="primary"
        className={classes.button}
        onClick={_submitSortValues}
        disabled={selectedValue === ''}
      >
        Sort
      </Button>
    </div>
  );
}
