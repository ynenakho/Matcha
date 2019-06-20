import React, { Component } from 'react';

export class MessageInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: ''
    };
  }

  _onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { message } = this.state;
    const { sendMessage } = this.props;
    return (
      <div>
        <input
          type="text"
          name="message"
          value={message}
          onChange={this._onChange}
        />
        <button onClick={() => sendMessage(message)}>SEND</button>
      </div>
    );
  }
}

export default MessageInput;
