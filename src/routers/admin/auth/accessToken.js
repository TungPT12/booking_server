const express = require('express');

const accessTokenController = require('../../../controllers/admin/auth/accessToken');
const router = express.Router();

router.post('/access-token', accessTokenController.isAccessToken);

module.exports = router;