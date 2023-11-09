const express = require('express');
const verifyAdminToken = require('../../verifyToken/verifyAdminToken').verifyAdminToken;
const typeController = require('../../controllers/admin/type');
const router = express.Router();

router.post('/type', verifyAdminToken, typeController.createType);
router.get('/types', verifyAdminToken, typeController.getTypes);
router.delete('/type/:id', verifyAdminToken, typeController.deleteType);

module.exports = router;