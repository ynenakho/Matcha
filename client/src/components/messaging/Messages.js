import React, { Component } from 'react';

class Messages extends Component {
  _renderMessages = () => {
    const { messages } = this.props;
    console.log('In messages _renderMessages =', messages);

    return messages.map(message => (
      <li key={message._id}>{message.message}</li>
    ));
  };

  render() {
    return (
      <div>
        <h1>messages</h1>
        <ul>{this._renderMessages()}</ul>
      </div>
    );
  }
}

export default Messages;
