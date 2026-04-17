const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String },
  phone: { type: String },
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
    default: 'New' 
  },
  value: { type: Number, default: 0 },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  source: { type: String },
  description: { type: String }
}, { timestamps: true });

// Performance Indexes for analytics
LeadSchema.index({ status: 1 });
LeadSchema.index({ value: -1 });
LeadSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Lead', LeadSchema);
