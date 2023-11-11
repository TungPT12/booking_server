const express = require('express');
const verifyAdminToken = require('../../verifyToken/verifyAdminToken').verifyAdminToken;
const hotelController = require('../../controllers/admin/hotel');
const router = express.Router();

router.post('/hotel', verifyAdminToken, hotelController.createHotel);
router.get('/hotels', verifyAdminToken, hotelController.getHotels);
router.get('/hotels/enable', verifyAdminToken, hotelController.getEnableHotels);
router.get('/hotel/:id', verifyAdminToken, hotelController.getHotelById);
router.put('/hotel', verifyAdminToken, hotelController.updateHotelById);
router.delete('/hotel/:id', verifyAdminToken, hotelController.deleteHotelById);

module.exports = router;