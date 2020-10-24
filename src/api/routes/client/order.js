const express = require('express');
const router = express.Router({ mergeParams: true });
const OrderService = require('../../../services/order');
const { orderAddValidation } = require('../../validators/orderValidator')

const orderService = new OrderService();

router.post('/',
    orderAddValidation,
    async (req, res) => {
        const appId = req.params.appId;
        const customerId = req.user.id;
        const result = await orderService.add({
            appId,
            customerId,
            orderInfo: req.body
        })
        res.json(result);
    });

module.exports = router;