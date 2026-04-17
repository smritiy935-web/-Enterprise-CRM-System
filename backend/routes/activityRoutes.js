const express = require('express');
const router = express.Router();
const { getActivities, createActivity } = require('../controllers/activityController');
const auth = require('../middleware/auth');

router.get('/', auth, getActivities);
router.post('/', auth, createActivity);

module.exports = router;
