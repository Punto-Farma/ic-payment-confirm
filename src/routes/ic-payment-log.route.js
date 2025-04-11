const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const PaymentController = require('../controllers/ic-payment-log.controller');

router.get('/icPaymentLog/:codigoTransaccion', auth.verifyToken, PaymentController.getIcPaymentLog);
router.post('/icPaymentLog/confirmPaymentWithCard', auth.verifyToken, PaymentController.confirmPaymentWithCard);

module.exports = router;