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
    const { displayMessage, chat } = this.props;
    const socket = openSocket('localhost:4000');
    socket.emit('join', { chatId: chat.chat._id });

    socket.on('connect', () => {
      console.log('Connected');
    });
    socket.on(MESSAGE_RECIEVED, ({ messageObj, chatId }) => {
      console.log('mesage recieved', messageObj, chatId);
      console.log(chat.chat);

      displayMessage(messageObj);
    });

    this.setState({ socket });
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    const { getProfile, createChat, auth, profile, getMessages } = this.props;
    let chat;
    if (_.isEmpty(profile)) {
      let prof = await getProfile(id);
      chat = await createChat([auth.user.id, prof._userId]);
    } else {
      chat = await createChat([auth.user.id, profile._userId]);
    }
    getMessages(chat._id);
    this.initSocket();
  }

  _sendMessage = async (chatId, message) => {
    const { socket } = this.state;
    const { sendMessage } = this.props;
    console.log('In main chat sendMessage', chatId, message);
    const messageObj = await sendMessage(message, chatId);
    socket.emit(MESSAGE_SENT, { chatId, messageObj });
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
    console.log('In render chatId', chat.chat._id);

    return (
      <div>
        <h1>Chat room with PERSON NAME</h1>
        {chat.messages.length ? (
          <Messages
            messages={chat.messages}
            user={'Your name'}
            typingUser={'user is typing'}
          />
        ) : null}
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
