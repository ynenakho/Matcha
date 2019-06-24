import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2)
  }
});

export class Footer extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <footer className={classes.footer}>
          {/* <Typography variant="h6" align="center" gutterBottom>
            Footer
          </Typography> */}
          <Typography
            variant="subtitle1"
            align="center"
            color="textSecondary"
            component="p"
          >
            Matcha &copy; {new Date().getFullYear()}, created by Yuriy Nenakhov
          </Typography>
        </footer>
      </div>
    );
  }
}

export default withStyles(styles)(Footer);
