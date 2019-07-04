const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const keys = require('./config/keys');
const logger = require('morgan');
const routes = require('./routes/routes');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const SocketIo = require('socket.io');
const SocketManager = require('./services/socketManager');

const app = express();

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

mongoose.connect(keys.mongoURI, { useNewUrlParser: true }, () =>
  console.log('MongoDB connected')
);
mongoose.set('useCreateIndex', true);

app.set('trust proxy', true);

app.use(cors());
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(passport.initialize());
app.use(multer({ storage: storage, fileFilter: fileFilter }).single('file'));
app.use('/images', express.static(path.join(__dirname, '/images')));

routes(app);

// Server  static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 4000;
const server = http.createServer(app);
const io = SocketIo(server);

io.on('connection', SocketManager);

server.listen(port, () => console.log('Server listening on', port));
