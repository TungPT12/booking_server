const express = require('express');

const accessTokenController = require('../../../controllers/client/auth/accessToken');
const router = express.Router();

router.post('/access-token', accessTokenController.isAccessToken);

module.exports = router;