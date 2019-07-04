const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const Picture = require('../models/pictureModel');
const Connection = require('../models/connectionModel');
const Like = require('../models/likeModel');
const keys = require('../config/keys');
const fs = require('fs');
const AWS = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');

exports.deletePicturePost = async (req, res) => {
  try {
    const pictureToDelete = await Picture.findById(req.params.pictureid);
    // fs.unlink('.' + pictureToDelete.path, err => {
    //   if (err)
    //     res.status(500).json({ error: 'Couldnt delete picture from storage' });
    // });
    if (!pictureToDelete) {
      return res.status(500).json({ error: 'Picture Not Found' });
    }
    const s3bucket = new AWS.S3({
      accessKeyId: keys.AWSAccessKey,
      secretAccessKey: keys.AWSSecretAccessKey,
      region: keys.AWSRegion
    });

    const params = {
      Bucket: keys.S3Bucket,
      Key: pictureToDelete.pictureName
        ? pictureToDelete.pictureName
        : pictureToDelete.path
    };

    s3bucket.deleteObject(params, (err, data) => {
      if (err) return res.status(500).json({ error: err });
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

    for (let i = 0; i < likes.length; i++) {
      await likes[i].remove();
      profile.rating -= 1;
    }
    await profile.save();
    // WAS DELETING THE CONNECTION IF THERE ARE NO MORE LIKES FROM OTHER USER
    // DONT THINK ITS NECESARY
    // for (let i = 0; i < likes.length; i++) {
    //   if (likes[i].likedBy !== req.user.id) {
    //     const restOfLikes = await Like.find({
    //       _userId: req.user.id,
    //       likedBy: likes[i].likedBy
    //     });
    //     if (!restOfLikes.length) {
    //       // Make disconnection
    //       const connection = await Connection.findOne({
    //         _userId: req.user.id,
    //         connectedTo: likes[i].likedBy
    //       });
    //       if (connection) {
    //         connection.remove(err => {
    //           if (err) {
    //             return res
    //               .status(500)
    //               .json({ error: "Couldn't find connection" });
    //           }
    //         });
    //       }
    //       const connectionBack = await Connection.findOne({
    //         _userId: likes[i].likedBy,
    //         connectedTo: req.user.id
    //       });
    //       if (connectionBack) {
    //         connectionBack.remove(err => {
    //           if (err) {
    //             return res
    //               .status(500)
    //               .json({ error: "Couldn't find connection back" });
    //           }
    //         });
    //       }
    //     }
    //   }
    // }

    return res.json({ picture: deletedPicture, rating: profile.rating });
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

exports.likePicturePost = async (req, res) => {
  try {
    let currentUserProfile;
    const existingLike = await Like.findOne({
      _userId: req.params.userid,
      _pictureId: req.params.pictureid,
      likedBy: req.user.id
    });
    const profile = await Profile.findOne({
      _userId: req.params.userid
    });
    if (req.params.userid === req.user.id) {
      currentUserProfile = profile;
    } else {
      currentUserProfile = await Profile.findOne({
        _userId: req.user.id
      });
    }
    //Find out if user you trying to like blocked you so hes not suppose to get notified about you liking his photos
    // const block = Block.findOne({
    //   _userId: req.user.id,
    //   blockedBy: req.params.userid
    // });
    // const blocked = block ? true : false;

    // Check for firstname and lastname in profile
    const userName =
      currentUserProfile.firstName && currentUserProfile.lastName
        ? currentUserProfile.firstName + ' ' + currentUserProfile.lastName
        : currentUserProfile.firstName
        ? currentUserProfile.firstName
        : currentUserProfile.lastName
        ? currentUserProfile.lastName
        : req.user.username;
    let connection;
    let allLikes = [];
    let allLikesBack = [];
    if (!existingLike) {
      const like = new Like({
        _userId: req.params.userid,
        _pictureId: req.params.pictureid,
        likedBy: req.user.id
      });
      profile.rating += 1;
      profile.save();
      const savedLike = await like.save();
      allLikes = await Like.find({
        _userId: req.user.id,
        likedBy: req.params.userid
      });
      if (allLikes.length >= 1) {
        // create connection
        connection = await Connection.findOne({
          _userId: req.user.id,
          connectedTo: req.params.userid
        });
        if (!connection && req.params.userid !== req.user.id) {
          const newConnection = new Connection({
            _userId: req.user.id,
            connectedTo: req.params.userid
          });
          newConnection.save(err => {
            if (err)
              return res.status(500).json({ error: 'Couldnt save connection' });
          });
          const newConnectionBack = new Connection({
            _userId: req.params.userid,
            connectedTo: req.user.id
          });
          newConnectionBack.save(err => {
            if (err)
              return res.status(500).json({ error: 'Couldnt save connection' });
          });
        }
      }
      return res.json({
        like: savedLike,
        connected:
          req.params.userid !== req.user.id && allLikes.length >= 1
            ? true
            : false,
        userName
        // blocked
      });
    } else {
      const deletedLike = await existingLike.remove();
      allLikes = await Like.find({
        _userId: req.params.userid,
        likedBy: req.user.id
      });
      allLikesBack = await Like.find({
        _userId: req.user.id,
        likedBy: req.params.userid
      });
      profile.rating -= 1;
      profile.save();
      if (
        (allLikes.length === 0 || allLikesBack.length === 0) &&
        req.params.userid !== req.user.id
      ) {
        connection = await Connection.findOne({
          _userId: req.user.id,
          connectedTo: req.params.userid
        });
        if (connection) {
          connection.remove(err => {
            if (err)
              return res
                .status(500)
                .json({ error: 'Couldnt delete connection' });
          });
        }
        const connectionBack = await Connection.findOne({
          _userId: req.params.userid,
          connectedTo: req.user.id
        });
        if (connectionBack) {
          connectionBack.remove(err => {
            if (err)
              return res
                .status(500)
                .json({ error: 'Couldnt delete connection' });
          });
        }
      }
      return res.json({
        like: deletedLike,
        connected:
          allLikes.length &&
          allLikesBack.length &&
          req.params.userid !== req.user.id
            ? true
            : false,
        userName
        // blocked
      });
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
  const fileName = `${req.user.username}-${new Date().getTime()}.png`;
  const s3FileURL = keys.AWSFileURL;
  const file = req.file;

  const s3bucket = new AWS.S3({
    accessKeyId: keys.AWSAccessKey,
    secretAccessKey: keys.AWSSecretAccessKey,
    region: keys.AWSRegion
  });

  const params = {
    Bucket: keys.S3Bucket,
    Key: fileName,
    Body: file.buffer,
    ContentType: 'image/jpeg',
    ACL: 'public-read'
  };

  s3bucket.upload(params, (err, data) => {
    if (err) return res.status(500).json({ error: err });

    const picture = new Picture({
      _userId: req.user.id,
      path: s3FileURL + fileName,
      pictureName: fileName
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
  });
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

/*
exports.uploadPicturePost = (req, res, next) => {
  const { picturePath } = req.body;
  const { _id, username } = req.user;

  const base64String = picturePath.replace(/^data:image\/png;base64,/, '');
  const base64Data = new Buffer.from(base64String, 'base64');
  const fileName = `${username}-${new Date().getTime()}.png`;
  const s3FileURL = keys.AWSFileURL;

  const s3bucket = new AWS.S3({
    accessKeyId: keys.AWSAccessKey,
    secretAccessKey: keys.AWSSecretAccessKey,
    region: keys.AWSRegion
  });

  const params = {
    Bucket: keys.S3Bucket,
    Key: fileName,
    Body: base64Data,
    ContentType: 'image/jpeg',
    ACL: 'public-read',
    ContentEncoding: 'base64'
  };

  s3bucket.upload(params, (err, data) => {
    if (err) return res.status(500).json({ error: err });
    const newPicture = new Picture({
      picturePath: s3FileURL + fileName,
      _userId: _id,
      pictureName: fileName
    });

    newPicture.save(err => {
      if (err) return next(err);
    });

    res.json({ picture: newPicture });
  });
};

exports.pictureDelete = (req, res, next) => {
  Picture.findById(req.params.id)
    .then(picture => {
      // Check for picture owner
      if (picture._userId.toString() !== req.user.id) {
        return res.status(401).json({ error: 'User not authorized' });
      }

      const s3bucket = new AWS.S3({
        accessKeyId: keys.AWSAccessKey,
        secretAccessKey: keys.AWSSecretAccessKey,
        region: keys.AWSRegion
      });

      const params = {
        Bucket: keys.S3Bucket,
        Key: picture.pictureName
      };

      console.log('PARAMS=', params);

      s3bucket.deleteObject(params, (err, data) => {
        if (err) return res.status(500).json({ error: err });
      });

      picture
        .remove()
        .then(picture => res.json({ pictureId: picture._id }))
        .catch(err => res.status(404).json({ error: err }));
    })
    .catch(err => res.status(404).json({ error: 'Picture not found' }));
};
*/
