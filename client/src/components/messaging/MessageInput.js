import React, { Component } from 'react';
import styles from './Chat.module.css';

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
      <div className={styles.messageinput}>
        <form onSubmit={this._onSubmit} className={styles.messageform}>
          <input
            type="text"
            name="message"
            value={message}
            onChange={this._onChange}
            autoComplete="off"
            className={styles.formcontrol}
            placeholder="Type something..."
          />
          <button
            type="submit"
            className={styles.send}
            disabled={!message.length}
          >
            SEND
          </button>
        </form>
      </div>
    );
  }
}

export default MessageInput;
