const express = require('express');
const verifyAdminToken = require('../../verifyToken/verifyAdminToken').verifyAdminToken;
const userController = require('../../controllers/admin/user');
const router = express.Router();

router.get('/users', verifyAdminToken, userController.getUsers);
router.get('/users/count', verifyAdminToken, userController.getNumberUsers);
router.put('/user/enable/:id', verifyAdminToken, userController.enableUser);
router.post('/user', verifyAdminToken, userController.createUser);
router.put('/user/disable/:id', verifyAdminToken, userController.disableUser);

module.exports = router;