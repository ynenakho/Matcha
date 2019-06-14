const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const Picture = require('../models/pictureModel');
const Like = require('../models/likeModel');
const keys = require('../config/keys');

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
      for (let i = 0; i < profiles.length; i++) {
        const picture = await Picture.findById(profiles[i]._profilePictureId);
        if (!picture) {
          profiles[i].picture = '/images/picture-default.jpg';
        } else {
          profiles[i].picture = picture.path;
        }
      }
      return res.json({ profiles });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
};
exports.searchProfilesGet = async (req, res) => {
  try {
    const { ageFrom, ageTo, location, rating, tags } = req.query;
    console.log(req.query);
    const ageToSearch = ageFrom && !ageTo ? 1000 : ageTo;
    const ageFromSearch = ageTo && !ageFrom ? 1000 : ageFrom;
    console.log(ageFromSearch, ageToSearch);

    console.log(
      new Date(new Date().setFullYear(new Date().getFullYear() - ageFrom))
    );

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
        for (let i = 0; i < profiles.length; i++) {
          const picture = await Picture.findById(profiles[i]._profilePictureId);
          if (!picture) {
            profiles[i].picture = '/images/picture-default.jpg';
          } else {
            profiles[i].picture = picture.path;
          }
        }
        return res.json({ profiles });
      }
    }
    //RETURN PROFILES!!!!!!!!!!!!!!!

    // const profiles = await Profile.find({}).lean();
    // if (!profiles) {
    //   return res.json({ profiles: [] });
    // } else {
    //   for (let i = 0; i < profiles.length; i++) {
    //     const picture = await Picture.findById(profiles[i]._profilePictureId);
    //     if (!picture) {
    //       profiles[i].picture = '/images/picture-default.jpg';
    //     } else {
    //       profiles[i].picture = picture.path;
    //     }
    //   }
    //   return res.json({ profiles });
    // }
  } catch (err) {
    res.status(500).send({ error: err });
  }
};
