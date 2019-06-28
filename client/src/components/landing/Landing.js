import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundImage: "url('/img/cover.jpg')",
    height: 'calc(100vh - 125px)',
    width: '100vw',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    textAlign: 'center'
  },
  text: {
    fontFamily: '"Comic Sans MS", cursive, sans-serif',
    fontSize: '6vw',
    letterSpacing: '2.4px',
    wordSpacing: '0.2px',
    color: '#ff85be',
    fontWeight: '700',
    textDecoration: 'none',
    fontStyle: 'normal',
    fontVariant: 'small-caps',
    textTransform: 'none',
    marginTop: '15vh'
  },
  link: {
    fontFamily: '"Comic Sans MS", cursive, sans-serif',
    fontSize: '4vw',
    letterSpacing: '2.4px',
    wordSpacing: '0.2px',
    color: '#ff85be',
    fontWeight: '700',
    textDecoration: 'none',
    fontStyle: 'normal',
    fontVariant: 'small-caps',
    textTransform: 'none',
    marginTop: '15%',
    '&:hover': {
      textShadow: '2px 2px blue'
    }
  },
  wrapperDiv: {
    display: 'inline-block',
    width: '40vw'
  },
  linkDiv: {
    display: 'flex',
    justifyContent: 'space-between'
  }
});

class Landing extends Component {
  _renderLnks = (classes, auth) => {
    if (auth.authenticated) {
      return (
        <div className={classes.linkDiv}>
          <Link to="/search" className={classes.link}>
            Search
          </Link>
          <Link to={`/profile/${auth.user.id}`} className={classes.link}>
            Profile
          </Link>
        </div>
      );
    } else {
      return (
        <div className={classes.linkDiv}>
          <Link to="/login" className={classes.link}>
            Login
          </Link>
          <Link to="/login" className={classes.link}>
            SignUp
          </Link>
        </div>
      );
    }
  };
  render() {
    const { classes, auth } = this.props;
    return (
      <div className={classes.root}>
        <Typography
          className={classes.text}
          variant="h4"
          component="h3"
          color="primary"
        >
          Find Your Love on Matcha!
        </Typography>
        <div className={classes.wrapperDiv}>
          {this._renderLnks(classes, auth)}
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(Landing);
