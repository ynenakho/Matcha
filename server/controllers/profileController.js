const User = require('../models/userModel');
const Block = require('../models/blockModel');
const Profile = require('../models/profileModel');
const Connection = require('../models/connectionModel');
const Picture = require('../models/pictureModel');
const Like = require('../models/likeModel');
const keys = require('../config/keys');
const axios = require('axios');

exports.createProfilePost = async (req, res) => {
  const {
    firstName,
    lastName,
    gender,
    sexPref,
    bio,
    location,
    interests,
    birthDate
  } = req.body;

  //axios get to lookup ip
  // let ip = req.ip;
  // if (ip.substr(0, 7) == '::ffff:') {
  //   ip = ip.substr(7);
  // }
  // console.log(ip);

  // const loc = await axios.get(`http://ip-api.com/json/64.62.224.29`);
  // console.log(loc.data);

  let splittedInterests = [];
  if (interests) {
    splittedInterests = interests.split(/[, \n]/);
    splittedInterests = splittedInterests.filter(elem => elem !== '');
    splittedInterests = new Set(splittedInterests);
  }
  splittedInterests = [...splittedInterests];
  Profile.findOne({ _userId: req.user.id }).then(profile => {
    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.gender = gender;
      profile.sexPref = sexPref;
      profile.bio = bio;
      profile.location = location;
      profile.interests = splittedInterests;
      profile.birthDate = new Date(birthDate);
    } else {
      profile = new Profile({
        _userId: req.user.id,
        firstName,
        lastName,
        gender,
        sexPref,
        bio,
        location,
        birthDate,
        interests: splittedInterests
      });
    }
    profile.save(err => {
      if (err) res.status(500).send({ error: err });
      return res.json({ profile });
    });
  });
};

exports.currentProfileGet = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      _userId: req.params.userid
    }).lean();
    if (!profile) {
      return res.json({ profile: {} });
    }
    if (req.user.id !== req.params.userid) {
      const blocked = await Block.findOne({
        blockedBy: req.user.id,
        _userId: req.params.userid
      });
      profile.blocked = blocked ? true : false;
      const connected = await Connection.findOne({
        _userId: req.user.id,
        connectedTo: req.params.userid
      });
      profile.connected = connected ? true : false;
    }
    return res.json({ profile });
  } catch (err) {
    return res.status(500).send({ error: err });
  }
};
