import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { TextField, MenuItem, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  searchField: {
    display: 'flex',
    flexDirection: 'row'
    // justifyContent: 'left'
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
  dense: {
    marginTop: 16
  },
  button: {
    // marginTop: theme.spacing.unit * 2,
    // width: '60%'
  }
});

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ageFrom: '',
      ageTo: ''
    };
  }

  _handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  _submitSearchValues = () => {
    const { searchProfiles } = this.props;
    // const { ageFrom, ageTo } = this.state;
    searchProfiles(this.state);
    // console.log(this.state);
  };

  render() {
    const { classes } = this.props;
    const { ageTo, ageFrom } = this.state;
    return (
      <div>
        <h1>SearchBar</h1>
        <div className={classes.searchField}>
          Age:
          <form>
            <TextField
              name="ageFrom"
              label="Age From"
              className={classNames(classes.textField, classes.dense)}
              variant="outlined"
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
              variant="outlined"
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
            <Button
              variant="outlined"
              size="medium"
              color="primary"
              className={classes.button}
              onClick={this._submitSearchValues}
              disabled={ageFrom === '' && ageTo === ''}
            >
              Search
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(SearchBar);
