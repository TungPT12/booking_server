const express = require('express');
// const verifyUserToken = require('../../auth/verifyUserToken').verifyUserToken;
const roomController = require('../../controllers/client/room');
const router = express.Router();


router.get('/rooms/validRooms/:hotelId', roomController.getRooByHotelId);


module.exports = router;