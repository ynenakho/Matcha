const User = require('../models/userModel');
const Connection = require('../models/connectionModel');
const Profile = require('../models/profileModel');
const Picture = require('../models/pictureModel');
const Like = require('../models/likeModel');
const Block = require('../models/blockModel');
const keys = require('../config/keys');
const NodeGeocoder = require('node-geocoder');
const geodist = require('geodist');

exports.connectedProfilesGet = async (req, res) => {
  try {
    const profiles = await Profile.find({}).lean();
    if (!profiles) {
      return res.json({ profiles: [] });
    } else {
      const connections = await Connection.find({ connectedTo: req.user.id });
      const returnArray = profiles.filter(profile => {
        for (let i = 0; i < connections.length; i++) {
          if (
            connections[i]._userId.toString() === profile._userId.toString()
          ) {
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
        returnArray[i].connected = true;
      }
      return res.json({ profiles: returnArray });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

exports.likedYouProfilesGet = async (req, res) => {
  try {
    const profiles = await Profile.find({}).lean();
    if (!profiles) {
      return res.json({ profiles: [] });
    } else {
      const likes = await Like.find({ _userId: req.user.id });
      const returnArray = profiles.filter(profile => {
        for (let i = 0; i < likes.length; i++) {
          if (likes[i].likedBy.toString() === profile._userId.toString()) {
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
      }

      return res.json({ profiles: returnArray });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

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
      profiles = await Profile.find({})
        .sort({ rating: -1 })
        .lean();
    } else {
      profiles = await Profile.find({ gender: sexPref })
        .sort({ rating: -1 })
        .lean();
    }
    if (!profiles) {
      return res.json({ profiles: [] });
    } else {
      const blockedByYou = await Block.find({ blockedBy: req.user.id });
      const blockedYou = await Block.find({ _userId: req.user.id });
      const returnArray = profiles.filter(profile => {
        for (let i = 0; i < blockedByYou.length; i++) {
          if (
            blockedByYou[i]._userId.toString() === profile._userId.toString()
          ) {
            return false;
          }
        }
        for (let i = 0; i < blockedYou.length; i++) {
          if (
            blockedYou[i].blockedBy.toString() === profile._userId.toString()
          ) {
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
    const profiles = await Profile.find().lean();
    if (!profiles) {
      return res.json({ profiles: [] });
    }
    let returnArray;
    let latitude;
    let longitude;
    let tagsArray;
    if (location) {
      const options = {
        provider: 'google',
        httpAdapter: 'https',
        apiKey: keys.googleAPIKey,
        formatter: null
      };
      const geocoder = NodeGeocoder(options);
      const address = await geocoder.geocode(location);
      // console.log('HERE', address[0]);
      latitude = address[0] ? address[0].latitude : null;
      longitude = address[0] ? address[0].longitude : null;
    }
    if (tags) {
      tagsArray = tags.split(' ').map(elem => elem.toLowerCase());
    }
    console.log('got here', tagsArray);

    returnArray = profiles.filter(profile => {
      if (
        (ageFromSearch &&
          ageToSearch &&
          profile.birthDate <
            new Date(
              new Date().setFullYear(new Date().getFullYear() - ageToSearch - 1)
            )) ||
        profile.birthDate >
          new Date(
            new Date().setFullYear(new Date().getFullYear() - ageFromSearch)
          )
      ) {
        return false;
      }
      if (
        latitude &&
        longitude &&
        geodist(
          { lat: profile.latitude, lon: profile.longitude },
          { lat: latitude, lon: longitude }
        ) > 100
      ) {
        return false;
      }
      for (let i = 0; i < tagsArray.length; i++) {
        if (
          !profile.interests.length ||
          !profile.interests
            .map(elem => elem.toLowerCase())
            .includes(tagsArray[i])
        ) {
          return false;
        }
      }
      return true;
    });
    console.log('got here');

    returnArray = returnArray.filter(profile => {
      for (let i = 0; i < blocks.length; i++) {
        if (blocks[i]._userId.toString() === profile._userId.toString()) {
          return false;
        }
      }
      return true;
    });

    for (let i = 0; i < returnArray.length; i++) {
      const picture = await Picture.findById(returnArray[i]._profilePictureId);
      if (!picture) {
        returnArray[i].picture = '/images/picture-default.jpg';
      } else {
        returnArray[i].picture = picture.path;
      }
      returnArray[i].blocked = false;
    }
    return res.json({ profiles: returnArray });

    // if (ageFromSearch && ageToSearch) {
    //   const profiles = await Profile.find({
    //     birthDate: {
    //       $gte: new Date(
    //         new Date().setFullYear(new Date().getFullYear() - ageToSearch - 1)
    //       ),
    //       $lt: new Date(
    //         new Date().setFullYear(new Date().getFullYear() - ageFromSearch)
    //       )
    //     }
    //   }).lean();
    //   if (!profiles) {
    //     return res.json({ profiles: [] });
    //   } else {
    //     const returnArray = profiles.filter(profile => {
    //       for (let i = 0; i < blocks.length; i++) {
    //         if (blocks[i]._userId.toString() === profile._userId.toString()) {
    //           return false;
    //         }
    //       }
    //       return true;
    //     });

    //     for (let i = 0; i < returnArray.length; i++) {
    //       const picture = await Picture.findById(
    //         returnArray[i]._profilePictureId
    //       );
    //       if (!picture) {
    //         returnArray[i].picture = '/images/picture-default.jpg';
    //       } else {
    //         returnArray[i].picture = picture.path;
    //       }
    //       returnArray[i].blocked = false;
    //     }
    //     return res.json({ profiles: returnArray });
    //   }

    // }
  } catch (err) {
    res.status(500).send({ error: err.response });
  }
};
