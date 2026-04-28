const express = require('express');
const router = express.Router();
const { getActivities, createActivity, deleteActivity } = require('../controllers/activityController');
const auth = require('../middleware/auth');

router.get('/', auth, getActivities);
router.post('/', auth, createActivity);
router.delete('/:id', auth, deleteActivity);

module.exports = router;
