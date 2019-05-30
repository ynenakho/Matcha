import React, { Component } from 'react';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import LikeButton from '../common/LikeButton';
import DeleteButton from '../common/DeleteButton';
import * as profileActions from '../../actions/profileActions';

const styles = theme => ({
  root: {
    flexGrow: 1
  }
});

export class PictureDiv extends Component {
  _renderButtons = (picture, auth, likePicture, deletePicture) => {
    return (
      <div>
        <LikeButton likePicture={likePicture} auth={auth} picture={picture} />
        <DeleteButton deletePicture={deletePicture} pictureId={picture._id} />
      </div>
    );
  };

  render() {
    const { picture, auth, likePicture, deletePicture } = this.props;
    return (
      <div>
        <img src={picture.path} alt="" width="100%" />
        {this._renderButtons(picture, auth, likePicture, deletePicture)}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default compose(
  connect(
    mapStateToProps,
    profileActions
  ),
  withStyles(styles)
)(PictureDiv);
