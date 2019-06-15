const mongoose = require('mongoose');
const { Schema } = mongoose;

const blockSchema = new Schema({
  _userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  blockedBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  createdAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Block', blockSchema);
