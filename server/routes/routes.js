const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');

const passport = require('passport');
require('../services/passport');

const requireSignin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = app => {
  // Auth routes
  app.get('/api/current', requireAuth, authController.currentUserGet);
  app.post('/api/forgotpassword', authController.forgotPasswordPost);
  app.post('/api/signup', authController.signupPost);
  app.post('/api/login', requireSignin, authController.loginPost);
  app.get('/api/confirmation', authController.confirmationGet);
  app.post('/api/resend', authController.resendTokenPost);
  app.post('/api/user/edit', requireAuth, authController.editUserPost);

  // Profile routes
  app.get('/api/pictures', requireAuth, profileController.getAllPicturesGet);
  app.get('/api/profile', requireAuth, profileController.currentProfileGet);
  app.get('/api/picture', requireAuth, profileController.currentPictureGet);
  app.post('/api/profile', requireAuth, profileController.createProfilePost);
  app.post(
    '/api/profile/picture',
    requireAuth,
    profileController.uploadPicturePost
  );
  app.post(
    '/api/picture/like/:pictureid/:userid',
    requireAuth,
    profileController.likePicturePost
  );
  app.post(
    '/api/picture/delete/:pictureid',
    requireAuth,
    profileController.deletePicturePost
  );
};
