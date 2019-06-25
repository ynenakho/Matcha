const Block = require('../models/blockModel');
const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const Picture = require('../models/pictureModel');
const History = require('../models/historyModel');
const Like = require('../models/likeModel');
const keys = require('../config/keys');

exports.saveToHistoryPost = async (req, res) => {
  try {
    const newHistoryItem = new History({
      _userId: req.body.userId,
      visitedBy: req.user.id
    });
    const block = await Block.findOne({
      _userId: req.user.id,
      blockedBy: req.body.userId
    });
    const blocked = block ? true : false;

    newHistoryItem.save();
    const profile = await Profile.findOne({ _userId: req.body.userId }).lean();
    profile.visitedAt = newHistoryItem.createdAt;
    return res.json({ history: profile, blocked });
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

exports.visitedGet = async (req, res) => {
  try {
    const { page } = req.params;
    // GET BY 5 USERS
    const arrProfiles = [];
    const history = await History.find({ visitedBy: req.user.id })
      .limit(5)
      .skip(5 * page)
      .sort({
        createdAt: -1
      });

    for (let i = 0; i < history.length; i++) {
      const profile = await Profile.findOne({
        _userId: history[i]._userId
      }).lean();
      const picture = await Picture.findById(profile._profilePictureId);
      if (!picture) {
        profile.picture = '/images/picture-default.jpg';
      } else {
        profile.picture = picture.path;
      }
      profile.visitedAt = history[i].createdAt;
      arrProfiles.push(profile);
    }
    return res.json({ history: arrProfiles });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.visitorsGet = async (req, res) => {
  try {
    const { page } = req.params;
    // GET BY 5 USERS
    const arrProfiles = [];
    const history = await History.find({ _userId: req.user.id })
      .limit(5)
      .skip(5 * page)
      .sort({
        createdAt: -1
      });
    for (let i = 0; i < history.length; i++) {
      const profile = await Profile.findOne({
        _userId: history[i].visitedBy
      }).lean();
      const picture = await Picture.findById(profile._profilePictureId);
      if (!picture) {
        profile.picture = '/images/picture-default.jpg';
      } else {
        profile.picture = picture.path;
      }
      profile.visitedAt = history[i].createdAt;
      arrProfiles.push(profile);
    }
    return res.json({ history: arrProfiles });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
