const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Chat = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const fromUserId = req.user._id;
    let chat = await Chat.findOne({
      participants: { $all: [fromUserId, targetUserId] },
    }).populate({ path: "messages.senderId", select: "firstName lastName photoURL" });
    if (!chat) {
      chat = new Chat({
        participants: [fromUserId, targetUserId],
        messages: [],
      });
    }
    chat.save();
    res.json(chat);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

module.exports = chatRouter;
