const express = require('express');
const typeController = require('../../controllers/client/type');
const router = express.Router();

router.get('/type/count-hotel', typeController.getNumberHotelByType);


module.exports = router;