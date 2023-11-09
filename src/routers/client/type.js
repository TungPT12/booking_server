const express = require('express');
const typeController = require('../../controllers/client/type');
const router = express.Router();

router.get('/type/count-hotel/:id', typeController.getNumberHotelByType);


module.exports = router;