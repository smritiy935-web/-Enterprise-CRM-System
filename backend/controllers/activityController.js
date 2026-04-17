const Activity = require('../models/Activity');

const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('lead', 'firstName lastName company')
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching activities' });
  }
};

const createActivity = async (req, res) => {
  try {
    const { leadId, type, description, status } = req.body;
    const newActivity = new Activity({
      lead: leadId,
      user: req.user.id,
      type,
      description,
      status
    });
    const savedActivity = await newActivity.save();

    const populatedActivity = await Activity.findById(savedActivity._id)
      .populate('lead', 'firstName lastName company')
      .populate('user', 'name');

    // Broadcast live update
    if (req.io) {
      req.io.emit('activity_added', populatedActivity);
    }

    res.status(201).json(populatedActivity);
  } catch (err) {
    res.status(500).json({ message: 'Error creating activity' });
  }
};

module.exports = { getActivities, createActivity };
