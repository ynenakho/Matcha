import React, { Component } from 'react';
import { connect } from 'react-redux';
import openSocket from 'socket.io-client';
import Messages from './Messages';
import MessageInput from './MessageInput';
import { MESSAGE_SENT, MESSAGE_RECIEVED, TYPING } from '../common/events';
import * as chatActions from '../../actions/chatActions';
import * as profileActions from '../../actions/profileActions';
import _ from 'lodash';

// import styles from './Chat.module.css';
import './Chat.module.css';

// const socketUrl = 'localhost:4000';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      user: null
    };
  }

  initSocket = () => {
    // const socket = io(socketUrl);
    const socket = openSocket('localhost:4000');
    socket.on('connect', () => {
      console.log('Connected');
    });
    socket.on(MESSAGE_RECIEVED, ({ message, chatId }) => {
      console.log('mesage recieved', message, chatId);
    });

    this.setState({ socket });
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    const { getProfile, createChat, auth, profile } = this.props;
    if (_.isEmpty(profile)) {
      let prof = await getProfile(id);
      createChat([auth.user.id, prof._userId]);
    } else {
      createChat([auth.user.id, profile._userId]);
    }
    this.initSocket();
  }

  _sendMessage = (chatId, message) => {
    const { socket } = this.state;
    console.log('In main chat sendMessage', chatId, message);
    socket.emit(MESSAGE_SENT, { chatId, message });
  };

  _sendTyping = (chatId, isTyping) => {
    const { socket } = this.state;
    socket.emit(TYPING, { chatId, isTyping });
  };

  render() {
    const { chat } = this.props;
    if (_.isEmpty(chat.chat)) {
      return <div>Still Getting chat set up</div>;
    }
    console.log(chat.chat);

    return (
      <div>
        <h1>Chat room with PERSON NAME</h1>
        <Messages
          messages={['some message1', 'some message2', 'some message3']}
          user={'Your name'}
          typingUser={'user is typing'}
        />
        <MessageInput
          sendMessage={message => {
            this._sendMessage(chat.chat._id, message);
          }}
          sendTyping={isTyping => {
            this._sendTyping(chat.chat._id, 'isTyping boolean');
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  chat: state.chat,
  auth: state.auth,
  profile: state.profile.profile
});

const mapDispatchToProps = {
  ...profileActions,
  ...chatActions
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);
