import React from 'react';

export const Messages = props => {
  const _renderMessages = () => {
    const { messages, user, chatWith } = props;
    console.log('In messages _renderMessages =', messages);

    return messages.map(message => (
      <li key={message._id}>
        {(user._userId === message._userId ? user.firstName : chatWith) +
          ': ' +
          message.message}
      </li>
    ));
  };

  return (
    <div>
      <ul>{_renderMessages()}</ul>
    </div>
  );
};

export default Messages;
