const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/signout', authController.signout);
router.post('/send-verification-code', authController.sendVerificationCode);

module.exports = router;