const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const Picture = require('../models/pictureModel');
const Like = require('../models/likeModel');
const keys = require('../config/keys');
const axios = require('axios');

// exports.deletePicturePost = async (req, res) => {
//   try {
//     const pictureToDelete = await Picture.findById(req.params.pictureid);
//     const deletedPicture = await pictureToDelete.remove();
//     const likes = await Like.find({ _pictureId: req.params.pictureid });
//     const profile = await Profile.findOne({ _userId: req.user.id });
//     profile.numOfPictures -= 1;
//     if (profile._profilePictureId.toString() === req.params.pictureid) {
//       profile._profilePictureId = await Picture.findOne({
//         _userId: req.user.id
//       });
//     }
//     await profile.save();
//     if (likes.length) {
//       for (let i = 0; i < likes.length; i++) {
//         const deletedLike = await likes[i].remove();
//         // CHECK FOR CONNECTIONS AND DELETE THEM BEFORE RETURNING VALUE
//       }
//     }
//     return res.json({ picture: deletedPicture });
//   } catch (err) {
//     res.status(500).send({ error: err });
//   }
// };

// exports.likePicturePost = async (req, res) => {
//   try {
//     const existingLike = await Like.findOne({
//       _userId: req.params.userid,
//       _pictureId: req.params.pictureid,
//       likedBy: req.user.id
//     });
//     if (!existingLike) {
//       const like = new Like({
//         _userId: req.params.userid,
//         _pictureId: req.params.pictureid,
//         likedBy: req.user.id
//       });
//       const savedLike = await like.save();
//       const allLikes = await Like.find({
//         _userId: req.user.id,
//         likedBy: req.params.userid
//       });
//       if (allLikes.length === 1) {
//         // create connection
//       }

//       return res.json({ like: savedLike });
//     } else {
//       const deletedLike = await existingLike.remove();
//       const allLikes = await Like.find({
//         _userId: req.user.id,
//         likedBy: req.params.userid
//       });
//       if (allLikes.length === 0) {
//         // try to find and remove connections
//       }
//       return res.json({ like: deletedLike });
//     }
//   } catch (err) {
//     res.status(500).send({ error: err });
//   }
// };

// exports.getAllPicturesGet = async (req, res) => {
//   try {
//     const pictures = await Picture.find({ _userId: req.params.userid }).lean();
//     if (!pictures) {
//       return res.json({ pictures: [] });
//     } else {
//       for (let i = 0; i < pictures.length; i++) {
//         const likes = await Like.find({ _pictureId: pictures[i]._id });
//         if (!likes.length) {
//           pictures[i].likes = [];
//         } else {
//           pictures[i].likes = likes;
//         }
//       }
//       return res.json({ pictures });
//     }
//   } catch (err) {
//     res.status(500).send({ error: err });
//   }
// };

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

// exports.uploadPicturePost = (req, res) => {
//   const picture = new Picture({
//     _userId: req.user.id,
//     path: '/' + req.file.path
//   });

//   Profile.findOne({ _userId: req.user.id })
//     .then(profile => {
//       if (!profile) {
//         const newProfile = new Profile({
//           _profilePictureId: picture._id,
//           _userId: req.user.id,
//           numOfPictures: 1
//         });
//         picture.save((err, picture) => {
//           if (err) return res.status(500).send({ error: err });
//           newProfile.save(err => {
//             if (err) return res.status(500).send({ error: err });
//             const retPicture = picture.toObject();
//             retPicture.likes = [];
//             return res.json({ picture: retPicture });
//           });
//         });
//       } else if (profile.numOfPictures < 5) {
//         profile._profilePictureId = picture._id;
//         profile.numOfPictures += 1;
//         picture.save((err, picture) => {
//           if (err) return res.status(500).send({ error: err });
//           profile.save(err => {
//             if (err) return res.status(500).send({ error: err });
//             const retPicture = picture.toObject();
//             retPicture.likes = [];
//             return res.json({ picture: retPicture });
//           });
//         });
//       } else {
//         return res.status(400).json({
//           error: 'You have reached maximum ammount of pictures uploaded'
//         });
//       }
//     })
//     .catch(err => res.status(500).json({ error: err }));
// };

exports.currentProfileGet = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _userId: req.params.userid });
    if (!profile) {
      return res.json({ profile: {} });
    }
    return res.json({ profile });
  } catch (err) {
    return res.status(500).send({ error: err });
  }
};

// exports.currentPictureGet = async (req, res) => {
//   try {
//     const profile = await Profile.findOne({ _userId: req.params.userid });
//     if (!profile) {
//       return res.json({ picture: {} });
//     } else {
//       const picture = await Picture.findById(profile._profilePictureId);
//       if (!picture) {
//         return res.json({ picture: {} });
//       }
//       return res.json({ picture });
//     }
//   } catch (err) {
//     return res.status(500).send({ error: err });
//   }
// };

// exports.setAvatarPost = async (req, res) => {
//   try {
//     const profile = await Profile.findOne({ _userId: req.user._id });
//     const picture = await Picture.findById(req.params.pictureid);
//     profile._profilePictureId = req.params.pictureid;
//     profile.save();
//     return res.json({ picture });
//   } catch (err) {
//     return res.status(500).send({ error: err });
//   }
// };

// exports.forgotPasswordPost = (req, res) => {
//   const email = req.body.email;
//   User.findOne({ email })
//     .then(existingUser => {
//       if (!existingUser)
//         return res.status(400).json({ error: 'Email not registered' });
//       const newPassword = passwordGen(6);
//       existingUser.password = bcrypt.hashSync(newPassword, 10);
//       existingUser.save(err => {
//         if (err) return res.status(500).send({ error: err });

//         // Send the email
//         sgMail.setApiKey(keys.sendGridKey);
//         const mailOptions = {
//           from: 'no-reply@camagru.com',
//           to: email,
//           subject: 'Account Verification Token',
//           text: `Hello, ${existingUser.username}
//         Your new password is ${newPassword}`
//         };
//         sgMail.send(mailOptions, err => {
//           if (err) return res.status(500).send({ error: err });
//           res.send({
//             message: `New Password has been sent to ${email}.`
//           });
//         });
//       });
//     })
//     .catch(err => res.status(500).send({ error: err }));
// };
