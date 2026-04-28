const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password, role });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, name, email, role } });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[AUTH] Login Attempt: ${email}`);

    // Admin Bypass with Database Persistence
    if (email === 'admin@apex.com' && password === 'admin123') {
      console.log('[AUTH] ADMIN BYPASS GRANTED - PERSISTING...');
      let adminUser = await User.findOne({ email: 'admin@apex.com' });
      if (!adminUser) {
        adminUser = new User({
          name: 'Smriti Yadav',
          email: 'admin@apex.com',
          password: 'admin123',
          role: 'Admin'
        });
        await adminUser.save();
      }
      const token = jwt.sign({ id: adminUser._id, role: 'Admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
      return res.json({ token, user: { id: adminUser._id, name: adminUser.name, email: adminUser.email, role: adminUser.role } });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[AUTH] FAILED: User not found - ${email}`);
      return res.status(400).json({ message: 'User not found. Try admin@apex.com' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`[AUTH] FAILED: Password mismatch for ${email}`);
      return res.status(400).json({ message: 'Invalid password.' });
    }

    console.log(`[AUTH] SUCCESS: ${user.name} logged in`);
    user.lastLogin = Date.now();
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    if (err.name === 'MongooseServerSelectionError' || err.message.includes('ECONNREFUSED')) {
      return res.status(500).json({ message: 'Database Connection Error. Please check MONGODB_URI in Render settings.' });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword; // Pre-save hook will hash it
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating password' });
  }
};

const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting account' });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file uploaded' });
    
    // Store relative path for flexibility
    const avatarUrl = `/uploads/${req.file.filename}`;
    
    await User.findByIdAndUpdate(req.user.id, { avatar: avatarUrl });
    res.json({ avatar: avatarUrl });
  } catch (err) {
    console.error('Avatar upload error:', err);
    res.status(500).json({ message: 'Error saving avatar file' });
  }
};

const emergencyAdmin = async (req, res) => {
  try {
    console.log('[EMERGENCY] Starting Admin Recalibration...');
    
    // Purge existing admin to avoid duplicates
    const purge = await User.deleteMany({ email: 'admin@apex.com' });
    console.log(`[EMERGENCY] Deleted ${purge.deletedCount} old admin records`);

    const adminUser = new User({
      name: 'Apex Admin',
      email: 'admin@apex.com',
      password: 'admin123',
      role: 'Admin'
    });
    
    await adminUser.save();
    
    // Verify count
    const count = await User.countDocuments();
    console.log(`[EMERGENCY] SUCCESS: Admin created. Current User Count: ${count}`);
    
    res.send(`
      <div style="font-family: sans-serif; padding: 50px; text-align: center;">
        <h1 style="color: #10b981;">✅ Admin Recalibrated</h1>
        <p>Database now contains <b>${count}</b> users.</p>
        <p>Try logging in with <b>admin@apex.com</b> / <b>admin123</b></p>
        <p style="color: #6366f1; font-weight: bold;">Return to your live CRM URL to login.</p>
      </div>
    `);
  } catch (err) {
    console.error('[EMERGENCY] CRITICAL ERROR:', err);
    res.status(500).send('Emergency Recalibration Failed: ' + err.message);
  }
};

module.exports = { register, login, updateProfile, changePassword, deleteAccount, uploadAvatar, emergencyAdmin };
