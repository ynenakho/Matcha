import React, { Component } from 'react';

export class PictureDiv extends Component {
  render() {
    const { picture } = this.props;
    return (
      <div>
        <img src={picture.path} alt="" width="100%" />
      </div>
    );
  }
}

export default PictureDiv;
