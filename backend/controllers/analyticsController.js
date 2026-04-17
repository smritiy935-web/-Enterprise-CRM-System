const Lead = require('../models/Lead');

const getStats = async (req, res) => {
  try {
    const { period } = req.query;
    let startDate = new Date();
    
    // Set time range based on period
    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case '6month':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case 'yearly':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default: // weekly or monthly fallback
        startDate.setMonth(startDate.getMonth() - 1);
    }

    const query = { createdAt: { $gte: startDate } };

    const totalLeads = await Lead.countDocuments(query);
    const closedWon = await Lead.countDocuments({ ...query, status: 'Closed Won' });
    
    // Aggregation for total value
    const totalValueAgg = await Lead.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$value" } } }
    ]);
    const totalValue = totalValueAgg.length > 0 ? totalValueAgg[0].total : 0;
    
    const leadsByStatus = await Lead.aggregate([
      { $match: query },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const leadsBySource = await Lead.aggregate([
      { $match: query },
      { $group: { _id: "$source", count: { $sum: 1 } } }
    ]);

    const leadsByMonth = await Lead.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
          value: { $sum: "$value" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      summary: {
        totalLeads,
        closedWon,
        winRate: totalLeads > 0 ? ((closedWon / totalLeads) * 100).toFixed(2) : 0,
        totalValue: totalValue || 0
      },
      leadsByStatus: leadsByStatus || [],
      leadsBySource: leadsBySource || [],
      leadsByMonth: leadsByMonth || []
    });
  } catch (err) {
    console.error('Analytics Error:', err);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
};

module.exports = { getStats };
