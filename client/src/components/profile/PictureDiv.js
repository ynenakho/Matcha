import React, { Component } from 'react';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { connect } from 'react-redux';
import LikeButton from '../common/LikeButton';
import DeleteButton from '../common/DeleteButton';
import * as profileActions from '../../actions/profileActions';

const styles = theme => ({
  root: {
    flexGrow: 1
  }
});

class PictureDiv extends Component {
  _renderButtons = (
    picture,
    likePicture,
    deletePicture,
    auth,
    makeAvatarPicture
  ) => {
    if (auth.user.id === picture._userId) {
      return (
        <div>
          <LikeButton likePicture={likePicture} picture={picture} auth={auth} />
          <DeleteButton deletePicture={deletePicture} pictureId={picture._id} />
          <Button onClick={() => makeAvatarPicture(picture._id)}>
            Make Avatar
          </Button>
        </div>
      );
    }
    return (
      <div>
        <LikeButton likePicture={likePicture} picture={picture} auth={auth} />
      </div>
    );
  };

  render() {
    const {
      picture,
      likePicture,
      deletePicture,
      auth,
      makeAvatarPicture
    } = this.props;
    return (
      <div>
        <img src={picture.path} alt="" width="100%" />
        {this._renderButtons(
          picture,
          likePicture,
          deletePicture,
          auth,
          makeAvatarPicture
        )}
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
