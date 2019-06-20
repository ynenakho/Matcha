const io = require('../server.js').io;
const { MESSAGE_SENT, MESSAGE_RECIEVED } = require('../helpers/events');

module.exports = socket => {
  console.log('User connected. Socket Id =' + socket.id);

  socket.on(MESSAGE_SENT, ({ message, chatId }) => {
    console.log('got the message', message, chatId);
    socket.emit(MESSAGE_RECIEVED, { chatId, message });
  });
};

// sendMessageToChat = sender
