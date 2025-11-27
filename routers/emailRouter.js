const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const { identifier } = require('../middlewares/identification');

router.patch('/send', emailController.sendEmail);

module.exports = router;