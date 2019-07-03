const User = require('../models/userModel');
const Block = require('../models/blockModel');
const Profile = require('../models/profileModel');
const Connection = require('../models/connectionModel');
const Picture = require('../models/pictureModel');
const Like = require('../models/likeModel');
const keys = require('../config/keys');
const axios = require('axios');
// const where = require('node-where');
const NodeGeocoder = require('node-geocoder');
const _ = require('lodash');

exports.createProfilePost = async (req, res) => {
  const {
    firstName,
    lastName,
    gender,
    sexPref,
    bio,
    location,
    interests,
    birthDate,
    position,
    ip
  } = req.body;

  const options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: keys.googleAPIKey,
    formatter: null
  };

  const geocoder = NodeGeocoder(options);
  let address;
  let latitude;
  let longitude;
  if (!location && !_.isEmpty(position)) {
    latitude = position.lat;
    longitude = position.lon;
    address = await geocoder.reverse({
      lat: position.lat,
      lon: position.lon
    });
    address = address[0].formattedAddress;
  } else if (!location && ip) {
    //Lookup ip
    const loc = await axios.get(`http://ip-api.com/json/64.62.224.29`);
    address = `${loc.data.city}, ${loc.data.region}, ${
      loc.data.countryCode === 'US' ? 'USA' : loc.data.countryCode
    }`;
    latitude = loc.data.lat;
    longitude = loc.data.lon;
  } else {
    address = await geocoder.geocode(location);
    latitude = address[0] ? address[0].latitude : null;
    longitude = address[0] ? address[0].longitude : null;
    address = address[0] ? address[0].formattedAddress : null;
  }

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
      profile.location = address ? address : '';
      profile.interests = splittedInterests;
      profile.birthDate = new Date(birthDate);
      profile.latitude = latitude;
      profile.longitude = longitude;
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
