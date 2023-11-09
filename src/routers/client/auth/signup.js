const express = require('express');

const signupController = require('../../../controllers/client/auth/signup');
const router = express.Router();

router.post('/signup', signupController.signup);

module.exports = router;