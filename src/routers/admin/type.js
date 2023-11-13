const express = require('express');
const verifyAdminToken = require('../../verifyToken/verifyAdminToken').verifyAdminToken;
const typeController = require('../../controllers/admin/type');
const router = express.Router();

router.get('/types', verifyAdminToken, typeController.getTypes);
router.get('/type/:id', verifyAdminToken, typeController.getTypeById);
router.post('/type', verifyAdminToken, typeController.createType);
router.put('/type', verifyAdminToken, typeController.updateTypeById);
router.delete('/type/:id', verifyAdminToken, typeController.deleteType);

module.exports = router;