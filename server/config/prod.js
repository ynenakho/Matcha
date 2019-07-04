module.exports = {
  mongoURI: process.env.MONGO_URI,
  sendGridId: process.env.SEND_GRID_ID,
  sendGridKey: process.env.SEND_GRID_KEY,
  jwtTokenSecret: process.env.JWT_TOKEN_SECRET,
  clientURI: process.env.CLIENT_URI,
  S3Bucket: process.env.S3_BUCKET,
  AWSAccessKey: process.env.AWS_ACCESS_KEY_ID,
  AWSSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  AWSRegion: 'us-west-1',
  AWSFileURL: 'https://s3-us-west-1.amazonaws.com/matcha-prod-bucket/'
};
