const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  _userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  _chatId: { type: Schema.Types.ObjectId, required: true, ref: 'Chat' },
  message: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
