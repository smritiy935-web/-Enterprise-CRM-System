const Lead = require('../models/Lead');

const calculateScore = (lead) => {
  let score = 0;
  if (lead.status === 'Qualified') score += 30;
  if (lead.status === 'Negotiation') score += 50;
  if (lead.status === 'Closed Won') score += 100;
  if (lead.value > 100000) score += 20;
  if (lead.value > 50000) score += 10;
  return Math.min(score, 100);
};

const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).populate('assignedTo', 'name email');
    const leadsWithScores = leads.map(l => ({
      ...l.toObject(),
      aiScore: calculateScore(l)
    }));
    res.json(leadsWithScores);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createLead = async (req, res) => {
  try {
    console.log('[LEAD] Create Request Received:', req.body);
    
    if (!req.body.firstName || !req.body.lastName || !req.body.email) {
      console.log('[LEAD] VALIDATION FAILED: Missing required fields');
      return res.status(400).json({ message: 'Missing required fields: firstName, lastName, email' });
    }

    const newLead = new Lead({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      company: req.body.company || 'N/A',
      value: Number(req.body.value) || 0,
      status: req.body.status || 'New',
      source: req.body.source || 'Direct Entry'
    });

    const lead = await newLead.save();
    console.log('[LEAD] SUCCESS: Lead saved with ID:', lead._id);
    
    // Broadcast update
    if (req.io) {
      req.io.emit('lead_added', lead);
      console.log('[LEAD] BROADCAST: lead_added');
    }
    
    res.status(201).json(lead);
  } catch (err) {
    console.error('[LEAD] CRITICAL ERROR:', err.message);
    res.status(500).json({ message: 'Error creating lead: ' + err.message });
  }
};

const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (req.io) req.io.emit('lead_updated', lead);
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    if (req.io) req.io.emit('lead_deleted', req.params.id);
    res.json({ message: 'Lead removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getLeads, createLead, updateLead, deleteLead };
