const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const Picture = require('../models/pictureModel');
const Like = require('../models/likeModel');
const keys = require('../config/keys');

exports.getProfilesGet = async (req, res) => {
  try {
    const profiles = await Profile.find({}).lean();
    if (!profiles) {
      return res.json({ profiles: [] });
    } else {
      for (let i = 0; i < profiles.length; i++) {
        const picture = await Picture.findById(profiles[i]._profilePictureId);
        console.log(picture);
        if (!picture) {
          profiles[i].picture = '/images/picture-default.jpg';
        } else {
          profiles[i].picture = picture.path;
        }
      }
      console.log(profiles);
      // GET PICTURES FOR PROFILES
      return res.json({ profiles });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
};
