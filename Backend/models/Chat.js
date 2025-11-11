const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chats: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    messages: [{
      sender: { type: String, required: true },
      text: { type: String, required: true }
    }]
  }]
});

module.exports = mongoose.model('Chat', ChatSchema);