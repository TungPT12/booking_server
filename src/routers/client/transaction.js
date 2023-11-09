const express = require('express');
const verifyUserToken = require('../../verifyToken/verifyUserToken').verifyUserToken;
const transactionController = require('../../controllers/client/transaction');
const router = express.Router();

router.post('/transaction', verifyUserToken, transactionController.createTransaction);
router.get('/transactions', verifyUserToken, transactionController.getTransactions);


module.exports = router;