const express = require('express');
const verifyAdminToken = require('../../verifyToken/verifyAdminToken').verifyAdminToken;
const roomController = require('../../controllers/admin/room');
const router = express.Router();

router.post('/room', verifyAdminToken, roomController.createRoom);
router.get('/rooms', verifyAdminToken, roomController.getRooms);

module.exports = router;