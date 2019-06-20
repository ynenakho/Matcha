const io = require('../server.js').io;
const { MESSAGE_SENT, MESSAGE_RECIEVED } = require('../helpers/events');
const chatController = require('../controllers/chatController');

module.exports = socket => {
  console.log('User connected. Socket Id =', socket.id);

  socket.on('join', ({ chatId }) => {
    console.log('Joined', chatId);
    socket.join(chatId);
  });

  socket.on(MESSAGE_SENT, ({ messageObj, chatId }) => {
    console.log('got the message', messageObj);

    socket.broadcast.to(chatId).emit(MESSAGE_RECIEVED, { chatId, messageObj });
  });
};

// sendMessageToChat = sender
