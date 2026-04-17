const express = require('express');
const router = express.Router();
const { register, login, updateProfile, changePassword, deleteAccount, uploadAvatar, emergencyAdmin } = require('../controllers/authController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', register);
router.post('/login', login);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);
router.delete('/delete-account', auth, deleteAccount);
router.post('/avatar', auth, upload.single('avatar'), uploadAvatar);
router.get('/emergency-admin', emergencyAdmin);

module.exports = router;
