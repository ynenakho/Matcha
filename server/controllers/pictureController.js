const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const Picture = require('../models/pictureModel');
const Like = require('../models/likeModel');
const keys = require('../config/keys');
const fs = require('fs');

exports.deletePicturePost = async (req, res) => {
  try {
    const pictureToDelete = await Picture.findById(req.params.pictureid);
    console.log(pictureToDelete);
    fs.unlink('.' + pictureToDelete.path, err => {
      if (err) console.log(err);
    });
    const deletedPicture = await pictureToDelete.remove();
    const likes = await Like.find({ _pictureId: req.params.pictureid });
    const profile = await Profile.findOne({ _userId: req.user.id });
    profile.numOfPictures -= 1;
    if (profile._profilePictureId.toString() === req.params.pictureid) {
      profile._profilePictureId = await Picture.findOne({
        _userId: req.user.id
      });
    }
    await profile.save();
    if (likes.length) {
      for (let i = 0; i < likes.length; i++) {
        const deletedLike = await likes[i].remove();
        // CHECK FOR CONNECTIONS AND DELETE THEM BEFORE RETURNING VALUE
      }
    }
    return res.json({ picture: deletedPicture });
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

exports.likePicturePost = async (req, res) => {
  try {
    const existingLike = await Like.findOne({
      _userId: req.params.userid,
      _pictureId: req.params.pictureid,
      likedBy: req.user.id
    });
    if (!existingLike) {
      const like = new Like({
        _userId: req.params.userid,
        _pictureId: req.params.pictureid,
        likedBy: req.user.id
      });
      const savedLike = await like.save();
      const allLikes = await Like.find({
        _userId: req.user.id,
        likedBy: req.params.userid
      });
      if (allLikes.length === 1) {
        // create connection
      }

      return res.json({ like: savedLike });
    } else {
      const deletedLike = await existingLike.remove();
      const allLikes = await Like.find({
        _userId: req.user.id,
        likedBy: req.params.userid
      });
      if (allLikes.length === 0) {
        // try to find and remove connections
      }
      return res.json({ like: deletedLike });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

exports.getAllPicturesGet = async (req, res) => {
  try {
    const pictures = await Picture.find({ _userId: req.params.userid }).lean();
    if (!pictures) {
      return res.json({ pictures: [] });
    } else {
      for (let i = 0; i < pictures.length; i++) {
        const likes = await Like.find({ _pictureId: pictures[i]._id });
        if (!likes.length) {
          pictures[i].likes = [];
        } else {
          pictures[i].likes = likes;
        }
      }
      return res.json({ pictures });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

exports.uploadPicturePost = (req, res) => {
  const picture = new Picture({
    _userId: req.user.id,
    path: '/' + req.file.path
  });

  Profile.findOne({ _userId: req.user.id })
    .then(profile => {
      if (!profile) {
        const newProfile = new Profile({
          _profilePictureId: picture._id,
          _userId: req.user.id,
          numOfPictures: 1
        });
        picture.save((err, picture) => {
          if (err) return res.status(500).send({ error: err });
          newProfile.save(err => {
            if (err) return res.status(500).send({ error: err });
            const retPicture = picture.toObject();
            retPicture.likes = [];
            return res.json({ picture: retPicture });
          });
        });
      } else if (profile.numOfPictures < 5) {
        profile._profilePictureId = picture._id;
        profile.numOfPictures += 1;
        picture.save((err, picture) => {
          if (err) return res.status(500).send({ error: err });
          profile.save(err => {
            if (err) return res.status(500).send({ error: err });
            const retPicture = picture.toObject();
            retPicture.likes = [];
            return res.json({ picture: retPicture });
          });
        });
      } else {
        return res.status(400).json({
          error: 'You have reached maximum ammount of pictures uploaded'
        });
      }
    })
    .catch(err => res.status(500).json({ error: err }));
};

exports.currentPictureGet = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _userId: req.params.userid });
    if (!profile) {
      return res.json({ picture: {} });
    } else {
      const picture = await Picture.findById(profile._profilePictureId);
      if (!picture) {
        return res.json({ picture: {} });
      }
      return res.json({ picture });
    }
  } catch (err) {
    return res.status(500).send({ error: err });
  }
};

exports.setAvatarPost = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _userId: req.user._id });
    const picture = await Picture.findById(req.params.pictureid);
    profile._profilePictureId = req.params.pictureid;
    profile.save();
    return res.json({ picture });
  } catch (err) {
    return res.status(500).send({ error: err });
  }
};
