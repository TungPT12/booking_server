const express = require('express');
const areaController = require('../../controllers/client/area');
const router = express.Router();

router.get('/area/count-hotel/:id', areaController.getNumberHotelInArea);
router.get('/area/three-random/count-hotel', areaController.getThreeRandomAreaWithCountHotel);


module.exports = router;