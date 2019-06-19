const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const Picture = require('../models/pictureModel');
const VerificationToken = require('../models/veificationTokenModel');
const keys = require('../config/keys');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const passwordGen = require('../helpers/passwordGenerator');

const tokenForUser = user => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, keys.jwtTokenSecret);
};

exports.currentUserGet = async (req, res) => {
  try {
    let picture = {};
    let pictures = [];
    let profile = await Profile.findOne({ _userId: req.user.id });
    if (profile) {
      picture = await Picture.findById(profile._profilePictureId);
      pictures = await Picture.find({ _userId: req.user.id });
    } else {
      profile = {};
    }
    res.json({
      picture,
      pictures,
      profile,
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email
      }
    });
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

exports.changeOnlineStatusPatch = async (req, res) => {
  const { status } = req.body;
  try {
    const profile = await Profile.findOne({ _userId: req.user._id });
    if (!profile) {
      // return res.status(400).json({ error: 'Profile not created yet' });
    } else {
      profile.lastVisit = status;
      profile.save();
    }
    return res.json({ status });
  } catch (e) {
    res.status(500).send({ error: e });
  }
};

exports.editUserPost = async (req, res) => {
  const { username, password, password2, email, id } = req.body;
  const user = await User.findById(req.user.id);
  try {
    user.comparePassword(password, async (err, isMatch) => {
      if (err) return res.status(500).json({ error: err });
      if (!isMatch)
        return res.status(400).json({
          error:
            'Password does not match the password that you have on your profile'
        });
      else {
        if (user.username !== username) {
          let foundUser = await User.findOne({ username });

          if (foundUser)
            return res.status(400).json({ error: 'Username already taken' });
        }
        if (user.email !== email) {
          foundUser = await User.findOne({ email });

          if (foundUser)
            return res.status(400).json({ error: 'Email already taken' });
        }
        if (password2) {
          user.password = bcrypt.hashSync(password2, 10);
        }
        user.username = username;
        user.email = email;
        user.save(err => {
          if (err) return res.status(500).json({ error: err });
          return res.json({ token: tokenForUser(user) });
        });
      }
    });
  } catch (e) {
    return res.status(500).json({ error: err });
  }
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

exports.updateProfilePost = (req, res, next) => {
  const username = req.body.username;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const email = req.body.email;
  const id = req.body.id;

  User.findById(id)
    .then(existingUser => {
      existingUser.comparePassword(oldPassword, (err, isMatch) => {
        if (err) return res.status(500).send({ error: err });
        if (!isMatch)
          return res.status(400).json({
            error:
              'Password does not match the password that you have on your profile'
          });
        if (existingUser.username !== username) {
          User.findOne({ username })
            .then(foundUser => {
              if (foundUser)
                return res
                  .status(400)
                  .json({ error: 'Username already taken' });
            })
            .catch(err => res.status(500).send({ error: err }));
        }
        if (existingUser.email !== email) {
          User.findOne({ email })
            .then(foundUser => {
              if (foundUser)
                return res.status(400).json({ error: 'Email already taken' });
            })
            .catch(err => res.status(500).send({ error: err }));
        }
        if (newPassword) {
          existingUser.password = bcrypt.hashSync(newPassword, 10);
        }
        existingUser.username = username;
        existingUser.email = email;
        existingUser.save(err => {
          if (err) return res.status(500).send({ error: err });
          return res.json({ token: tokenForUser(existingUser) });
        });
      });
    })
    .catch(err => res.status(500).send({ error: err }));
};

exports.loginPost = (req, res) => {
  res.json({ token: tokenForUser(req.user) });
};

exports.signupPost = (req, res) => {
  const { username, password, email } = req.body;

  User.findOne({ username })
    .then(existingUser => {
      if (existingUser)
        return res
          .status(400)
          .json({ error: 'Email/User is already registered' });

      const hash = bcrypt.hashSync(password, 10);
      const user = new User({
        username,
        password: hash,
        email
      });

      user.save(err => {
        if (err) {
          if (err.name === 'MongoError' && err.code === 11000) {
            // Duplicate username
            return res
              .status(400)
              .send({ error: 'Email/User is already registered' });
          }
          return res.status(500).send({ error: err });
        }

        const verificationToken = new VerificationToken({
          _userId: user._id,
          token: crypto.randomBytes(16).toString('hex')
        });

        verificationToken.save(err => {
          if (err) return res.status(500).send({ error: err });

          // Send the email
          //!!!!!! change to https in prod
          sgMail.setApiKey(keys.sendGridKey);
          const mailOptions = {
            from: 'no-reply@camagru.com',
            to: email,
            subject: 'Account Verification Token',
            text: `Hello, ${username}\n
          Please verify your account by clicking the link:
          http://${req.headers.host}/api/confirmation?token=${
              verificationToken.token
            }&email=${email}.`
          };
          sgMail.send(mailOptions, err => {
            if (err) return res.status(500).send({ error: err });
            res.send({
              message: `A verification email has been sent to ${email}.`
            });
          });
        });
      });
    })
    .catch(err => res.status(500).send({ error: err }));
};

exports.confirmationGet = (req, res) => {
  const token = req.query.token;
  const email = req.query.email;

  VerificationToken.findOne({ token: token })
    .then(existingToken => {
      if (!existingToken)
        return res.status(400).send({
          error: 'We were unable to verify you. Token might be expired.'
        });

      User.findOne({ _id: existingToken._userId, email: email })
        .then(existingUser => {
          if (!existingUser)
            return res.status(400).send({
              error: 'We were unable to find a user for this token.'
            });
          if (existingUser.isVerified)
            return res
              .status(400)
              .send({ error: 'This user has already been verified.' });

          existingUser.isVerified = true;
          existingUser.save(err => {
            if (err) return res.status(500).send({ error: err });
            res.status(301).redirect(keys.clientURI + '/login');
          });
        })
        .catch(err => res.status(500).send({ error: err }));
    })
    .catch(err => res.status(500).send({ error: err }));
};

exports.resendTokenPost = (req, res) => {
  const email = req.body.email;

  User.findOne({ email: email })
    .then(existingUser => {
      if (!existingUser)
        return res
          .status(400)
          .send({ error: 'We were unable to find a user with that email.' });
      if (existingUser.isVerified)
        return res.status(400).send({
          error: 'This account has already been verified. Please log in.'
        });

      // Create a verification token, save it, and send email
      const verificationToken = new VerificationToken({
        _userId: existingUser._id,
        token: crypto.randomBytes(16).toString('hex')
      });

      // Save the token
      verificationToken.save(err => {
        if (err) return res.status(500).send({ error: err });

        // Send the email
        sgMail.setApiKey(keys.sendGridKey);
        var mailOptions = {
          from: 'no-reply@camagru.com',
          to: email,
          subject: 'Account Verification Token',
          text: `Hello, ${existingUser.username}
        
        Please verify your account by clicking the link:
        https://${req.headers.host}/api/confirmation?token=${
            verificationToken.token
          }&email=${email}.`
        };
        sgMail.send(mailOptions, err => {
          if (err) return res.status(500).send({ error: err });
          res.send({
            message: `A verification email has been sent to ${
              existingUser.email
            }.`
          });
        });
      });
    })
    .catch(err => res.status(500).send({ error: err }));
};
