const express = require('express');
const router = express.Router({ mergeParams: true });
const OrderService = require('../../../services/order');
const { orderAddValidation, orderIdValidation } = require('../../validators/orderValidator')

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

router.get('/',
    async (req, res) => {
        const customerId = req.user.id;
        const result = await orderService.getAllCustomer(customerId);
        res.json(result);
    });

router.get('/:orderId',
    orderIdValidation,
    async (req, res) => {
        const result = await orderService.getById(req.params.orderId);
        res.json(result);
    });

module.exports = router;