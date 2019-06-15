const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const Picture = require('../models/pictureModel');
const Like = require('../models/likeModel');
const Block = require('../models/blockModel');
const keys = require('../config/keys');

exports.blockedProfilesGet = async (req, res) => {
  try {
    const profiles = await Profile.find({}).lean();
    if (!profiles) {
      return res.json({ profiles: [] });
    } else {
      const blocks = await Block.find({ blockedBy: req.user.id });
      const returnArray = profiles.filter(profile => {
        for (let i = 0; i < blocks.length; i++) {
          if (blocks[i]._userId.toString() === profile._userId.toString()) {
            return true;
          }
        }
        return false;
      });
      for (let i = 0; i < returnArray.length; i++) {
        const picture = await Picture.findById(
          returnArray[i]._profilePictureId
        );
        if (!picture) {
          returnArray[i].picture = '/images/picture-default.jpg';
        } else {
          returnArray[i].picture = picture.path;
        }
        returnArray[i].blocked = true;
      }

      return res.json({ profiles: returnArray });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

exports.getProfilesGet = async (req, res) => {
  const { sexPref } = req.query;
  let profiles;
  try {
    if (sexPref === 'bisexual') {
      profiles = await Profile.find({}).lean();
    } else {
      profiles = await Profile.find({ gender: sexPref }).lean();
    }
    if (!profiles) {
      return res.json({ profiles: [] });
    } else {
      const blocks = await Block.find({ blockedBy: req.user.id });
      const returnArray = profiles.filter(profile => {
        for (let i = 0; i < blocks.length; i++) {
          if (blocks[i]._userId.toString() === profile._userId.toString()) {
            return false;
          }
        }
        return true;
      });
      for (let i = 0; i < returnArray.length; i++) {
        const picture = await Picture.findById(
          returnArray[i]._profilePictureId
        );
        if (!picture) {
          returnArray[i].picture = '/images/picture-default.jpg';
        } else {
          returnArray[i].picture = picture.path;
        }
        returnArray[i].blocked = false;
      }

      return res.json({ profiles: returnArray });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
};
exports.searchProfilesGet = async (req, res) => {
  try {
    const { ageFrom, ageTo, location, rating, tags } = req.query;
    const ageToSearch = ageFrom && !ageTo ? 1000 : ageTo;
    const ageFromSearch = ageTo && !ageFrom ? 1000 : ageFrom;
    const blocks = await Block.find({ blockedBy: req.user.id });
    if (ageFromSearch && ageToSearch) {
      const profiles = await Profile.find({
        birthDate: {
          $gte: new Date(
            new Date().setFullYear(new Date().getFullYear() - ageToSearch - 1)
          ),
          $lt: new Date(
            new Date().setFullYear(new Date().getFullYear() - ageFromSearch)
          )
        }
      }).lean();
      if (!profiles) {
        return res.json({ profiles: [] });
      } else {
        const returnArray = profiles.filter(profile => {
          for (let i = 0; i < blocks.length; i++) {
            if (blocks[i]._userId.toString() === profile._userId.toString()) {
              return false;
            }
          }
          return true;
        });

        for (let i = 0; i < returnArray.length; i++) {
          const picture = await Picture.findById(
            returnArray[i]._profilePictureId
          );
          if (!picture) {
            returnArray[i].picture = '/images/picture-default.jpg';
          } else {
            returnArray[i].picture = picture.path;
          }
          returnArray[i].blocked = false;
        }
        return res.json({ profiles: returnArray });
      }
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

exports.blockUserPost = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      _userId: req.params.userid
    }).lean();
    if (!profile) {
      return res.status(404).json({ error: 'Profile Not Found' });
    }
    const block = await Block.findOne({
      _userId: profile._userId,
      blockedBy: req.user.id
    });
    // Delete or add connection depends on likes

    if (block) {
      block.remove();
      profile.blocked = false;
      return res.json({ profile });
    } else {
      newBlock = new Block({
        _userId: profile._userId,
        blockedBy: req.user.id
      });
      newBlock.save(err => {
        if (err) res.status(500).send({ error: err });
        profile.blocked = true;
        return res.json({ profile });
      });
    }
  } catch (err) {
    return res.status(500).send({ error: err });
  }
};
