const chatModel = require("../models/chatModel");

// create chat
const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    if (chat) {
      return res.status(200).json(chat);
    }

    const newChat = await chatModel.create({
      members: [firstId, secondId],
    });

    return res.status(200).json(newChat);
  } catch (err) {
    res.status(500).json(err);
  }
};

// find all chats
const findAllChats = async (req, res) => {
  const { userId } = req.params;

  try {
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });
    res.status(200).json(chats);
  } catch (err) {}
};

// find single chat
const findASingleChat = async (req, res) => {
  const { firstId, secondId } = req.params;

  try {
    const singleChats = await chatModel.find({
      members: { $all: [firstId, secondId] },
    });
    res.status(200).json(singleChats);
  } catch (err) {}
};

module.exports = { createChat, findAllChats, findASingleChat };
