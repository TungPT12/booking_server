const express = require('express');
const areaController = require('../../controllers/client/area');
const router = express.Router();

router.get('/area/count-hotel/:id', areaController.getNumberHotelInArea);


module.exports = router;