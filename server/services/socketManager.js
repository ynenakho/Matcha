const io = require('../server.js').io;
const {
  MESSAGE_SENT,
  MESSAGE_RECIEVED,
  JOIN_CHAT,
  LEAVE_CHAT,
  NOTIFICATION_RECIEVED,
  JOIN_APP,
  LEAVE_APP,
  PROFILE_CHECKED,
  LIKE,
  DISCONNECTED_CONNECTION,
  CONNECTED_CONNECTION
} = require('../helpers/events');

module.exports = socket => {
  socket.on(JOIN_APP, ({ userId }) => {
    // console.log('Joined app userId =', userId);
    socket.join(userId);
  });

  socket.on(LEAVE_APP, ({ userId }) => {
    // console.log('Left app userId =', userId);
    socket.leave(userId);
    socket.removeAllListeners(userId);
  });

  socket.on(JOIN_CHAT, ({ chatId }) => {
    // console.log('Joined chat chatId =', chatId);
    socket.join(chatId);
  });

  socket.on(MESSAGE_SENT, ({ messageObj, chatId, userId, userName }) => {
    // console.log('got the message in chatId =', messageObj);
    socket.broadcast.to(chatId).emit(MESSAGE_RECIEVED, { chatId, messageObj });
    socket.broadcast.to(userId).emit(NOTIFICATION_RECIEVED, {
      notification: `New Message Recieved from ${userName}`
    });
  });

  socket.on(LIKE, ({ userId, userName }) => {
    // console.log('got like for userId =', userId);
    socket.broadcast.to(userId).emit(NOTIFICATION_RECIEVED, {
      notification: `${userName} liked your photo.`
    });
  });

  socket.on(DISCONNECTED_CONNECTION, ({ userId, userName }) => {
    // console.log('got disconnected for userId =', userId);
    socket.broadcast.to(userId).emit(NOTIFICATION_RECIEVED, {
      notification: `${userName} got disconnected from you.`
    });
  });

  socket.on(CONNECTED_CONNECTION, ({ userId, userName }) => {
    // console.log('got disconnected for userId =', userId);
    socket.broadcast.to(userId).emit(NOTIFICATION_RECIEVED, {
      notification: `${userName} liked you back. You are connected now.`
    });
  });

  socket.on(PROFILE_CHECKED, ({ userId, userName }) => {
    // console.log('profile has beed checked userId =', userId);
    socket.broadcast.to(userId).emit(NOTIFICATION_RECIEVED, {
      notification: `${userName} visited your profile`
    });
  });

  socket.on(LEAVE_CHAT, ({ chatId }) => {
    // console.log('Left chat chatId =', chatId);
    socket.leave(chatId);
    socket.removeAllListeners(chatId);
  });
};
