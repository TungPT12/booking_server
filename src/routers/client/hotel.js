const express = require('express');
const hotelController = require('../../controllers/client/hotel');
const router = express.Router();

router.get('/hotels/top-three', hotelController.getTopThreeRatingHotel);
router.get('/hotels/search', hotelController.searchHotels);
router.get('/hotel/:id', hotelController.getHotelById);

module.exports = router;