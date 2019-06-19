const User = require('../models/userModel');
const Block = require('../models/blockModel');
const Profile = require('../models/profileModel');
const Connection = require('../models/connectionModel');
const Picture = require('../models/pictureModel');
const Like = require('../models/likeModel');
const Chat = require('../models/chatModel');

exports.createChatPost = async (req, res) => {
  const { userIds } = req.body;
  console.log(userIds);
  console.log(req.body);

  try {
    let chat = await Chat.findOne({
      $or: [{ _userIds: userIds }, { _userIds: [userIds[1], userIds[0]] }]
    });
    console.log('got here');

    if (!chat) {
      chat = new Chat({
        _userIds: [userIds[0], userIds[1]]
      });
      await chat.save();
    }
    return res.json({ chat });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};
