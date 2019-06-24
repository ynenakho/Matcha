import React, { Component } from 'react';
import { connect } from 'react-redux';
// import openSocket from 'socket.io-client';
import Messages from './Messages';
import MessageInput from './MessageInput';
import {
  MESSAGE_SENT,
  MESSAGE_RECIEVED,
  TYPING,
  JOIN_CHAT,
  LEAVE_CHAT,
  JOIN_APP,
  LEAVE_APP
  // NOTIFICATION_RECIEVED
} from '../common/events';
import * as chatActions from '../../actions/chatActions';
import * as profileActions from '../../actions/profileActions';
import _ from 'lodash';

// import styles from './Chat.module.css';
import './Chat.module.css';

// const socketUrl = 'localhost:4000';

class Chat extends Component {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     socket: null,
  //     user: null
  //   };
  // }

  initSocket = userId => {
    // const socket = io(socketUrl);
    const { displayMessage, chat, socket } = this.props;
    // const socket = openSocket('http://localhost:4000');
    socket.emit(LEAVE_APP, { userId });
    socket.emit(JOIN_CHAT, { chatId: chat.chat._id });

    socket.on('connect', () => {
      console.log('Connected');
    });

    socket.on(MESSAGE_RECIEVED, ({ messageObj, chatId }) => {
      console.log('mesage recieved', messageObj, chatId);
      console.log(chat.chat);

      displayMessage(messageObj);
    });
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
    this.initSocket(auth.user.id);
  }

  componentWillUnmount() {
    const { chat, socket, auth } = this.props;
    socket.emit(LEAVE_CHAT, { chatId: chat.chat._id });
    socket.emit(JOIN_APP, { userId: auth.user.id });
  }

  _sendMessage = async (chatId, message, userId) => {
    // const { socket } = this.state;
    const { sendMessage, socket, auth } = this.props;
    console.log('In main chat sendMessage', chatId, message);
    const messageObj = await sendMessage(message, chatId);
    socket.emit(MESSAGE_SENT, {
      chatId,
      messageObj,
      userId,
      userName: auth.profile.firstName + ' ' + auth.profile.lastName
    });
  };

  _sendTyping = (chatId, isTyping) => {
    const { socket } = this.props;
    socket.emit(TYPING, { chatId, isTyping });
  };

  render() {
    const { chat, auth } = this.props;
    if (_.isEmpty(chat.chat) || _.isEmpty(chat.chatWith)) {
      return <div>Still Getting chat set up</div>;
    }
    console.log('In render chatId', chat.chat._id);

    return (
      <div>
        <h1>
          Chat room with{' '}
          {chat.chatWith.firstName + ' ' + chat.chatWith.lastName}
        </h1>
        {chat.messages.length ? (
          <Messages
            messages={chat.messages}
            user={auth.profile}
            chatWith={chat.chatWith.firstName}
            typingUser={'user is typing'}
          />
        ) : null}
        <MessageInput
          sendMessage={message => {
            this._sendMessage(chat.chat._id, message, chat.chatWith._userId);
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
  profile: state.profile.profile,
  socket: state.socket.socket
});

const mapDispatchToProps = {
  ...profileActions,
  ...chatActions
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);
