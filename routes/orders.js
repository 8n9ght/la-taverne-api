const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/orders');

router.get('/', orderCtrl.getAllOrders);
router.post('/', orderCtrl.createOrder);
router.put('/:id', orderCtrl.beginOrder);
router.put('/:id/ready', orderCtrl.readyOrder);
router.delete('/:id', orderCtrl.deleteOrder);

module.exports = router;