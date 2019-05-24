const mongoose = require('mongoose');
const { Schema } = mongoose;

const profileSchema = new Schema({
  _userId: { type: Schema.Types.ObjectId, ref: 'User' },
  firstName: { type: String },
  lastName: { type: String },
  gender: { type: String },
  sexPref: { type: String },
  bio: { type: String },
  rating: { type: Number },
  location: { type: String },
  interests: { type: Array },
  _profilePictureId: { type: Schema.Types.ObjectId, ref: 'Picture' },
  numOfPictures: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Profile', profileSchema);
