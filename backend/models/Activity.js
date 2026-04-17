const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['Email', 'Call', 'Meeting', 'Note'],
    required: true 
  },
  description: { type: String, required: true },
  status: { type: String, default: 'Completed' }
}, { timestamps: true });

module.exports = mongoose.model('Activity', ActivitySchema);
