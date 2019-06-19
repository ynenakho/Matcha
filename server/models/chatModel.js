const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
  _userIds: [
    { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    { type: Schema.Types.ObjectId, required: true, ref: 'User' }
  ],
  createdAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);
