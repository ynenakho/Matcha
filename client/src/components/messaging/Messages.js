import React, { useEffect, useRef } from 'react';
import styles from './Chat.module.css';
import moment from 'moment';

export const Messages = props => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [props.messages]);

  const _renderMessages = () => {
    const { messages, user, chatWith } = props;
    if (messages.length === 0) {
      return null;
    }
    const userName =
      chatWith.firstName && chatWith.lastName
        ? chatWith.firstName + ' ' + chatWith.lastName
        : chatWith.firstName
        ? chatWith.firstName
        : chatWith.lastName;
    return messages.map(message => (
      <div
        key={message._id}
        className={`${styles.messagecontainer} ${user._userId ===
          message._userId && styles.right}`}
      >
        <div className={styles.time}>
          {moment(message.createdAt).format('MM/DD/YY hh:mm a')}
        </div>
        <div className={styles.data}>
          <div className={styles.message}>{message.message}</div>
          <div className={styles.name}>
            {user._userId === message._userId ? user.firstName : userName}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className={styles.threadcontainer}>
      <div className={styles.thread}>
        {_renderMessages()}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Messages;
