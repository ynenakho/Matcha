const mongoose = require('mongoose');
const { Schema } = mongoose;

const likeSchema = new Schema({
  _userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  _pictureId: { type: Schema.Types.ObjectId, required: true, ref: 'Picture' },
  likedBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  createdAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Like', likeSchema);
