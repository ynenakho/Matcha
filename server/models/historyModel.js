const mongoose = require('mongoose');
const { Schema } = mongoose;

const historySchema = new Schema({
  _userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  visitedBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  createdAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('History', historySchema);
