const User = require('../models/userModel');
const Block = require('../models/blockModel');
const Profile = require('../models/profileModel');
const Connection = require('../models/connectionModel');
const Picture = require('../models/pictureModel');
const Like = require('../models/likeModel');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const io = require('../server.js').io;
const { MESSAGE_SENT, MESSAGE_RECIEVED } = require('../helpers/events');

exports.createChatPost = async (req, res) => {
  const { userIds } = req.body;
  try {
    let chat = await Chat.findOne({
      $or: [{ _userIds: userIds }, { _userIds: [userIds[1], userIds[0]] }]
    });
    if (!chat) {
      chat = new Chat({
        _userIds: [userIds[0], userIds[1]]
      });
      await chat.save();
    }
    const userId = req.user.id !== userIds[0] ? userIds[0] : userIds[1];
    const profile = await Profile.findOne({ _userId: userId });
    if (!profile) {
      return res.status(500).json({
        error: "Couldn't find profile of the user you having chat with"
      });
    }
    return res.json({ chat, profile });
  } catch (err) {
    return res.status(500).json({ error: err.response });
  }
};

exports.messagesGet = async (req, res) => {
  const { chatid } = req.params;
  try {
    const chat = await Chat.findById(chatid);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found ' });
    }
    if (!chat._userIds.includes(req.user.id)) {
      return res.status(401).json({
        error: 'You are not authorized to get messages from this chat'
      });
    }
    const messages = await Message.find({ _chatId: chatid }).sort({
      createdAt: 1
    });
    return res.json({ messages });
  } catch (err) {
    return res.status(500).json({ error: err.response });
  }
};

exports.createMessagePost = async (req, res) => {
  const { chatid } = req.params;
  const { message } = req.body;
  try {
    const chat = await Chat.findById(chatid);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found ' });
    }
    if (!chat._userIds.includes(req.user.id)) {
      return res.status(401).json({
        error: 'You are not authorized to send messages from this chat'
      });
    }
    const newMessage = new Message({
      _userId: req.user.id,
      _chatId: chatid,
      message
    });
    newMessage.save(err => {
      if (err) return res.status(500).json({ error: err });
    });
    // io.emit(MESSAGE_RECIEVED, { message: newMessage, chatId: chatId });
    return res.json({ message: newMessage });
  } catch (err) {
    return res.status(500).json({ error: err.response });
  }
};
