const mongoose = require('mongoose');
const { Schema } = mongoose;

const pictureSchema = new Schema({
  _userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  path: { type: String, required: true },
  details: { type: String },
  createdAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Picture', pictureSchema);
