// Server restart trigger: 2026-04-18 16:06:50 (Switching to Port 4000)
const express = require('express');
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Pass io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('join_dashboard', () => socket.join('crm_updates'));
  socket.on('send_message', (data) => io.emit('receive_message', data));
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/enterprise_crm';
console.log('[DB] Attempting to connect to MongoDB...');

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MONGODB CONNECTION ERROR:', err.message);
    console.error('[DB] Full error stack:', err.stack);
  });

// Routes
app.get('/', (req, res) => {
  res.send('API is running (Apex-CRM-Website)');
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Serve static assets in production
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));

// SPA Catch-all: Redirect all non-API requests to the frontend (Fixes 404 on refresh)
app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ message: 'API Route Not Found' });
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5081;
server.listen(PORT, '0.0.0.0', () => console.log(`🚀 System Online - Port ${PORT}`));
