const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const Picture = require('../models/pictureModel');
const keys = require('../config/keys');

exports.getAllPicturesGet = (req, res) => {
  Picture.find({ _userId: req.user.id })
    .then(pictures => {
      if (!pictures) {
        return res.json({ pictures: [] });
      } else {
        return res.json({ pictures });
      }
    })
    .catch(err => res.status(500).send({ error: err }));
};

exports.createProfilePost = (req, res) => {
  const {
    firstName,
    lastName,
    gender,
    sexPref,
    bio,
    location,
    interests
  } = req.body;
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
    } else {
      profile = new Profile({
        _userId: req.user.id,
        firstName,
        lastName,
        gender,
        sexPref,
        bio,
        location,
        interests: splittedInterests
      });
    }
    profile.save(err => {
      if (err) res.status(500).send({ error: err });
      return res.json({ profile });
    });
  });
};

exports.uploadPicturePost = (req, res) => {
  console.log(req.file);
  const picture = new Picture({
    _userId: req.user.id,
    path: '/' + req.file.path
  });
  //
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

            return res.json({ picture });
          });
        });
      } else if (profile.numOfPictures < 5) {
        profile._profilePictureId = picture._id;
        profile.numOfPictures += 1;
        picture.save((err, picture) => {
          if (err) return res.status(500).send({ error: err });
          profile.save(err => {
            if (err) return res.status(500).send({ error: err });
            return res.json({ picture });
          });
        });
      } else {
        return res.status(400).json({
          error: 'You have reached maximum ammount of pictures uploaded'
        });
      }
    })
    .catch(err => res.status(500).json({ error: err }));
  // });
};

exports.currentProfileGet = (req, res) => {
  Profile.findOne({ _userId: req.user.id })
    .then(profile => {
      if (!profile) {
        return res.json({ profile: {} });
      }
      res.json({ profile });
    })
    .catch(err => res.status(500).send({ error: err }));
};

exports.currentPictureGet = (req, res) => {
  Profile.findOne({ _userId: req.user.id })
    .then(profile => {
      if (!profile) {
        return res.json({ picture: {} });
      } else {
        Picture.findById(profile._profilePictureId).then(picture => {
          if (!picture) {
            return res.json({ picture: {} });
          }
          return res.json({ picture });
        });
      }
    })
    .catch(err => res.status(500).send({ error: err }));
};

exports.forgotPasswordPost = (req, res) => {
  const email = req.body.email;
  User.findOne({ email })
    .then(existingUser => {
      if (!existingUser)
        return res.status(400).json({ error: 'Email not registered' });
      const newPassword = passwordGen(6);
      existingUser.password = bcrypt.hashSync(newPassword, 10);
      existingUser.save(err => {
        if (err) return res.status(500).send({ error: err });

        // Send the email
        sgMail.setApiKey(keys.sendGridKey);
        const mailOptions = {
          from: 'no-reply@camagru.com',
          to: email,
          subject: 'Account Verification Token',
          text: `Hello, ${existingUser.username}
        Your new password is ${newPassword}`
        };
        sgMail.send(mailOptions, err => {
          if (err) return res.status(500).send({ error: err });
          res.send({
            message: `New Password has been sent to ${email}.`
          });
        });
      });
    })
    .catch(err => res.status(500).send({ error: err }));
};
