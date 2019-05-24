import React, { Component } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  approot: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 'calc(100vh - 32px)'
    // margin: 0
  }
};

class App extends Component {
  render() {
    const { children, classes } = this.props;

    return (
      <div className={classes.approot}>
        <Header />
        <div className="">{children}</div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(styles)(App);
