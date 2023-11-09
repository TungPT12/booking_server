const express = require('express');
const verifyAdminToken = require('../../verifyToken/verifyAdminToken').verifyAdminToken;
const areaController = require('../../controllers/admin/area');
const router = express.Router();

router.post('/area', verifyAdminToken, areaController.createArea);
router.get('/area/:id', verifyAdminToken, areaController.getAreaById);
router.get('/areas', verifyAdminToken, areaController.getAreas);
router.put('/area/:id', verifyAdminToken, areaController.updateAreaById);
router.delete('/area/:id', verifyAdminToken, areaController.deleteArea);


module.exports = router;