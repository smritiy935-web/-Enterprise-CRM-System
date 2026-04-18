const express = require('express');
const router = express.Router();
const { getStats, getReport } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

router.get('/stats', auth, getStats);
router.get('/report', getReport); // Public for easy download via window.open if needed, or add auth if requested.

module.exports = router;
