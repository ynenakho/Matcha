const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const profilesController = require('../controllers/profilesController');
const historyController = require('../controllers/historyController');
const pictureController = require('../controllers/pictureController');
const chatController = require('../controllers/chatController');
const keys = require('../config/keys');

const passport = require('passport');
require('../services/passport');

const requireSignin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

// const s3FileURL = keys.AWSFileURL;

//   const s3bucket = new AWS.S3({
//     accessKeyId: keys.AWSAccessKey,
//     secretAccessKey: keys.AWSSecretAccessKey,
//     region: keys.AWSRegion
//   });

//   // const params = {
//   //   Bucket: keys.S3Bucket,
//   //   Key: fileName,
//   //   Body: base64Data,
//   //   ContentType: 'image/jpeg',
//   //   ACL: 'public-read',
//   //   ContentEncoding: 'base64'
//   // };

//   const fileFilter = (req, file, cb) => {
//     if (
//       file.mimetype === 'image/png' ||
//       file.mimetype === 'image/jpg' ||
//       file.mimetype === 'image/jpeg'
//     ) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
//   };

// const upload = multer({
//   storage: multerS3({
//     s3: s3bucket,
//     bucket: keys.S3Bucket,
//     // metadata: function (req, file, cb) {
//     //   cb(null, {fieldName: file.fieldname});
//     // },
//     key: function (req, file, cb) {
//       cb(null, file.originalname + Date.now())
//     }
//   }),fileFilter: fileFilter

// })

module.exports = app => {
  //   // AWS s3 upload
  //   app.post('/upload', upload.array('upl',1), function (req, res, next) {
  //     res.send("Uploaded!");
  // });

  // Auth routes
  app.get('/api/current', requireAuth, authController.currentUserGet);
  app.patch(
    '/api/changeonlinestatus',
    requireAuth,
    authController.changeOnlineStatusPatch
  );
  app.post('/api/forgotpassword', authController.forgotPasswordPost);
  app.post('/api/signup', authController.signupPost);
  app.post('/api/login', requireSignin, authController.loginPost);
  app.get('/api/confirmation', authController.confirmationGet);
  app.post('/api/resend', authController.resendTokenPost);
  app.post('/api/user/edit', requireAuth, authController.editUserPost);

  // Picture routes
  app.get(
    '/api/pictures/:userid',
    requireAuth,
    pictureController.getAllPicturesGet
  );
  app.get(
    '/api/picture/:userid',
    requireAuth,
    pictureController.currentPictureGet
  );
  app.post(
    '/api/picture/:pictureid',
    requireAuth,
    pictureController.setAvatarPost
  );
  app.post(
    '/api/picture/like/:pictureid/:userid',
    requireAuth,
    pictureController.likePicturePost
  );
  app.post(
    '/api/picture/delete/:pictureid',
    requireAuth,
    pictureController.deletePicturePost
  );
  app.post(
    '/api/upload-picture',
    requireAuth,
    pictureController.uploadPicturePost
  );

  // Profile routes
  app.get(
    '/api/profile/:userid',
    requireAuth,
    profileController.currentProfileGet
  );
  app.post('/api/profile', requireAuth, profileController.createProfilePost);
  app.post('/api/block/:userid', requireAuth, profileController.blockUserPost);
  app.post(
    '/api/disconnect/:userid',
    requireAuth,
    profileController.disconnectUserPost
  );

  // Profiles routes
  app.get('/api/profiles', requireAuth, profilesController.getProfilesGet);
  app.get(
    '/api/profiles/blocked',
    requireAuth,
    profilesController.blockedProfilesGet
  );
  app.get(
    '/api/profiles/likedyou',
    requireAuth,
    profilesController.likedYouProfilesGet
  );
  app.get(
    '/api/profiles/connected',
    requireAuth,
    profilesController.connectedProfilesGet
  );
  app.get(
    '/api/profiles/search',
    requireAuth,
    profilesController.searchProfilesGet
  );

  // History routes
  app.post('/api/history', requireAuth, historyController.saveToHistoryPost);
  app.get('/api/visitors/:page', requireAuth, historyController.visitorsGet);
  app.get('/api/visited/:page', requireAuth, historyController.visitedGet);

  // Chat routes
  app.post('/api/chat', requireAuth, chatController.createChatPost);
  app.get(
    '/api/chat/messages/:chatid',
    requireAuth,
    chatController.messagesGet
  );
  app.post(
    '/api/chat/messages/:chatid',
    requireAuth,
    chatController.createMessagePost
  );
};
