const passport = require('passport');
const User = require('../models/userModel');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require('../config/keys');

const localOptions = {};
const localLogin = new LocalStrategy(
  localOptions,
  (username, password, done) => {
    User.findOne({ username: username }, (err, existingUser) => {
      if (err) return done(err);
      if (!existingUser)
        return done(null, false, { error: 'Incorrect username/password.' });
      existingUser.comparePassword(password, (err, isMatch) => {
        if (err) return done(err);
        if (!isMatch)
          return done(null, false, { error: 'Incorrect username/password.' });
        if (!existingUser.isVerified)
          return done(null, false, { error: 'Account has not been verified.' });
        done(null, existingUser, { message: 'Logged in successfully.' });
      });
    });
  }
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.jwtTokenSecret
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub, (err, existingUser) => {
    if (err) return done(err, false);
    if (!existingUser) return done(null, false);
    return done(null, existingUser);
  });
});

passport.use(localLogin);
passport.use(jwtLogin);
