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
  let ip = req.ip;
  if (ip.substr(0, 7) == '::ffff:') {
    ip = ip.substr(7);
  }
  console.log('IP', ip);

  const loc = await axios.get(`http://ip-api.com/json/64.62.224.29`);
  console.log('Location data', loc.data);
  // console.log('Geo', navigator.geolocation);

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
      const blockedByYou = await Block.findOne({
        blockedBy: req.user.id,
        _userId: req.params.userid
      });
      profile.blocked = blockedByYou ? true : false;
      const connected = await Connection.findOne({
        _userId: req.user.id,
        connectedTo: req.params.userid
      });
      profile.connected = connected ? true : false;
      const blockedYou = await Block.findOne({
        blockedBy: req.params.userid,
        _userId: req.user.id
      });
      profile.invisible = blockedYou ? true : false;
    }
    return res.json({ profile });
  } catch (err) {
    return res.status(500).send({ error: err });
  }
};

exports.blockUserPost = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      _userId: req.params.userid
    });
    if (!profile) {
      return res.status(404).json({ error: 'Profile Not Found' });
    }
    const block = await Block.findOne({
      _userId: profile._userId,
      blockedBy: req.user.id
    });
    let likes = [];
    if (block) {
      block.remove();
    } else {
      // Delete or add connection depends on likes
      likes = await Like.find({
        _userId: req.params.userid,
        likedBy: req.user.id
      });
      if (likes.length) {
        for (let i = 0; i < likes.length; i++) {
          likes[i].remove();
          profile.rating -= 1;
        }
      }
      await profile.save(err => {
        if (err) res.status(500).send({ error: err });
      });
      const connection = await Connection.findOne({
        _userId: req.user.id,
        connectedTo: req.params.userid
      });
      if (connection) {
        connection.remove();
      }
      const connectionBack = await Connection.findOne({
        _userId: req.params.userid,
        connectedTo: req.user.id
      });
      if (connectionBack) {
        connectionBack.remove();
      }
      newBlock = new Block({
        _userId: profile._userId,
        blockedBy: req.user.id
      });
      newBlock.save(err => {
        if (err) res.status(500).send({ error: err });
      });
    }
    const profileReturn = profile.toJSON();
    profileReturn.blocked = block ? false : true;
    profileReturn.connected = false;
    const currentUserProfile = await Profile.findOne({ _userId: req.user.id });
    const userName =
      currentUserProfile.firstName && currentUserProfile.lastName
        ? currentUserProfile.firstName + ' ' + currentUserProfile.lastName
        : currentUserProfile.firstName
        ? currentUserProfile.firstName
        : currentUserProfile.lastName
        ? currentUserProfile.lastName
        : req.user.username;
    return res.json({
      profile: profileReturn,
      likes,
      userName
    });
  } catch (err) {
    return res.status(500).send({ error: err });
  }
};

exports.disconnectUserPost = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      _userId: req.params.userid
    });
    if (!profile) {
      return res.status(404).json({ error: 'Profile Not Found' });
    }
    // MAKE DISCONNECTION!!!!!!!
    const connection = await Connection.findOne({
      _userId: req.user.id,
      connectedTo: req.params.userid
    });
    let likes = [];
    if (connection) {
      likes = await Like.find({
        _userId: req.params.userid,
        likedBy: req.user.id
      });
      if (likes.length) {
        for (let i = 0; i < likes.length; i++) {
          likes[i].remove();
          profile.rating -= 1;
        }
      }
      await profile.save();
      connection.remove();
      const connectionBack = await Connection.findOne({
        _userId: req.params.userid,
        connectedTo: req.user.id
      });
      if (connectionBack) {
        connectionBack.remove();
      }
    }
    const profileReturn = profile.toJSON();
    profileReturn.blocked = false;
    profileReturn.connected = false;
    const currentUserProfile = await Profile.findOne({ _userId: req.user.id });
    const userName =
      currentUserProfile.firstName && currentUserProfile.lastName
        ? currentUserProfile.firstName + ' ' + currentUserProfile.lastName
        : currentUserProfile.firstName
        ? currentUserProfile.firstName
        : currentUserProfile.lastName
        ? currentUserProfile.lastName
        : req.user.username;
    return res.json({
      profile: profileReturn,
      likes,
      userName
    });
  } catch (err) {
    return res.status(500).send({ error: err });
  }
};
