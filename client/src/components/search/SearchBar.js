import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { TextField, MenuItem, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  searchField: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  root: {
    marginTop: '20px'
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
    width: '100px',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  form: {
    alignItems: 'center'
  },
  button: {
    width: '90px'
  }
});

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ageFrom: '',
      ageTo: '',
      location: '',
      tags: ''
    };
  }

  _handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  _submitSearchValues = () => {
    const { searchProfiles } = this.props;
    searchProfiles(this.state);
  };

  render() {
    const { classes } = this.props;
    const { ageTo, ageFrom, location, tags } = this.state;
    return (
      <div className={classes.root}>
        <form className={classes.searchField}>
          <TextField
            name="ageFrom"
            label="Age From"
            className={classNames(classes.textField, classes.dense)}
            select
            value={ageFrom}
            onChange={this._handleChange}
            type="number"
          >
            {_.range(1, ageTo ? ageTo : 100).map(value => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="ageTo"
            label="Age To"
            className={classNames(classes.textField, classes.dense)}
            select
            value={ageTo}
            onChange={this._handleChange}
            type="number"
          >
            {_.range(ageFrom, 100).map(value => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="location"
            label="Location"
            className={classNames(classes.textField, classes.dense)}
            value={location}
            onChange={this._handleChange}
            type="text"
          />
          <TextField
            name="tags"
            label="Tags"
            className={classNames(classes.textField, classes.dense)}
            value={tags}
            onChange={this._handleChange}
            type="text"
          />
          <Button
            variant="outlined"
            size="medium"
            color="primary"
            className={classes.button}
            onClick={this._submitSearchValues}
            disabled={
              ageFrom === '' && ageTo === '' && location === '' && tags === ''
            }
          >
            Search
          </Button>
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(SearchBar);
