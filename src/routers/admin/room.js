const express = require('express');
const verifyAdminToken = require('../../verifyToken/verifyAdminToken').verifyAdminToken;
const roomController = require('../../controllers/admin/room');
const router = express.Router();

router.get('/rooms', verifyAdminToken, roomController.getRooms);
router.get('/room/:id', verifyAdminToken, roomController.getRoomById);
router.post('/room', verifyAdminToken, roomController.createRoom);
router.put('/room', verifyAdminToken, roomController.updateRoomById);
router.delete('/room/:id', verifyAdminToken, roomController.deleteRoomById);

module.exports = router;