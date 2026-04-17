const mongoose = require('mongoose');
const Lead = require('./models/Lead');
const User = require('./models/User');
const Activity = require('./models/Activity');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/enterprise_crm';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Lead.deleteMany({});
    await User.deleteMany({});
    await Activity.deleteMany({});
    console.log('Cleared all existing tables.');

    // Create Default Admin
    const adminUser = new User({
        name: 'Apex Admin',
        email: 'admin@apex.com',
        password: 'admin123',
        role: 'Admin'
    });
    
    await adminUser.save();
    console.log('-----------------------------------------');
    console.log('ADMIN ACCOUNT CREATED SUCCESSFULLY');
    console.log('Email: admin@apex.com');
    console.log('Password: admin123');
    console.log('-----------------------------------------');

    // Massive High-Density Lead Seeding (200 Records)
    const leads = [];
    const companies = ['Cyberdyne', 'Wayne Corp', 'Stark Ind', 'Oscorp', 'Daily Planet', 'Amazonia', 'S.H.I.E.L.D', 'Pym Tech', 'LexCorp', 'Tyrell Corp', 'Weyland-Yutani'];
    const statuses = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
    const sources = ['LinkedIn', 'Website', 'Referral', 'Event', 'Direct', 'Cold Call', 'Facebook Ads'];
    
    for (let i = 0; i < 200; i++) {
        const monthAgo = Math.floor(Math.random() * i % 12);
        const dayAgo = Math.floor(Math.random() * 28);
        const createdAt = new Date();
        createdAt.setMonth(createdAt.getMonth() - monthAgo);
        createdAt.setDate(createdAt.getDate() - dayAgo);

        leads.push({
            firstName: `Strategic_Lead`,
            lastName: `${i + 1}`,
            email: `intelligence_${i}@crm-apex.com`,
            company: companies[Math.floor(Math.random() * companies.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            value: Math.floor(Math.random() * 150000) + 10000,
            source: sources[Math.floor(Math.random() * sources.length)],
            createdAt
        });
    }

    const insertedLeads = await Lead.insertMany(leads);
    console.log(`MASSIVE SEEDING COMPLETE: Loaded ${leads.length} high-density records.`);

    // Generate Activities for those leads
    const activityTypes = ['Call', 'Email', 'Meeting', 'Note'];
    const sampleActivities = [];
    
    insertedLeads.slice(0, 50).forEach(lead => {
        sampleActivities.push({
            lead: lead._id,
            user: adminUser._id,
            type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
            description: `Auto-generated interaction log for ${lead.firstName} at ${lead.company}. Product demo scheduled.`,
            status: 'Completed',
            createdAt: lead.createdAt
        });
    });

    await Activity.insertMany(sampleActivities);
    console.log(`TIMELINE SEEDED: Generated ${sampleActivities.length} samples.`);

    console.log('Database finalized successfully!');
    process.exit();
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedData();
