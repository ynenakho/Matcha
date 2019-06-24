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
  LIKE
} = require('../helpers/events');
// const chatController = require('../controllers/chatController');

module.exports = socket => {
  console.log('User connected. Socket Id =', socket.id);

  socket.on(JOIN_APP, ({ userId }) => {
    console.log('Joined app userId =', userId);
    socket.join(userId);
  });

  socket.on(LEAVE_APP, ({ userId }) => {
    console.log('Left app userId =', userId);
    socket.leave(userId);
  });

  socket.on(JOIN_CHAT, ({ chatId }) => {
    console.log('Joined chat chatId =', chatId);
    socket.join(chatId);
  });

  socket.on(MESSAGE_SENT, ({ messageObj, chatId, userId, userName }) => {
    console.log('got the message in chatId =', messageObj);
    socket.broadcast.to(chatId).emit(MESSAGE_RECIEVED, { chatId, messageObj });
    socket.broadcast.to(userId).emit(NOTIFICATION_RECIEVED, {
      notification: `New Message Recieved from ${userName}`
    });
  });

  socket.on(LIKE, ({ userId, userName }) => {
    console.log('got like for userId =', userId);
    socket.broadcast.to(userId).emit(NOTIFICATION_RECIEVED, {
      notification: `Your Photo Got Liked by ${userName}`
    });
  });

  socket.on(PROFILE_CHECKED, ({ userId, userName }) => {
    console.log('profile has beed checked userId =', userId);
    socket.broadcast.to(userId).emit(NOTIFICATION_RECIEVED, {
      notification: `${userName} Visited Your Profile`
    });
  });

  socket.on(LEAVE_CHAT, ({ chatId }) => {
    console.log('Left chat chatId =', chatId);
    socket.leave(chatId);
  });
};

// sendMessageToChat = sender
