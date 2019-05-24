const mongoose = require('mongoose');
const { Schema } = mongoose;

const connectionSchema = new Schema({
  _userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  connectedTo: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  createdAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Connection', connectionSchema);
