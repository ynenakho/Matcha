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

  _onSubmit = e => {
    const { message } = this.state;
    const { sendMessage } = this.props;
    e.preventDefault();
    this.setState({ message: '' });
    sendMessage(message);
  };

  render() {
    const { message } = this.state;
    // const { sendMessage } = this.props;
    return (
      <div>
        <form onSubmit={this._onSubmit}>
          <input
            type="text"
            name="message"
            value={message}
            onChange={this._onChange}
          />
          <button type="submit">SEND</button>
        </form>
      </div>
    );
  }
}

export default MessageInput;
