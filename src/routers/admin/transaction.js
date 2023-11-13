const express = require('express');
const verifyAdminToken = require('../../verifyToken/verifyAdminToken').verifyAdminToken;
const transactionController = require('../../controllers/admin/transaction');
const router = express.Router();

router.get('/transactions', verifyAdminToken, transactionController.getTransactions);
router.get('/transactions/new', verifyAdminToken, transactionController.getTransactionsNew);
router.get('/transactions/count', verifyAdminToken, transactionController.getNumberTransactions);
router.get('/transactions/balance', verifyAdminToken, transactionController.getBalance);

module.exports = router;