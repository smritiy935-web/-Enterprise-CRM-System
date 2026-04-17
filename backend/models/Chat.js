const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  channel: { type: String, default: 'general' }
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);
