const io = require('../server.js').io;

module.exports = socket => {
  console.log('User connected. Socket Id =' + socket.id);
  // socket.on();
};

// sendMessageToChat = sender
