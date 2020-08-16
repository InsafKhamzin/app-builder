const express = require('express');
const router = express.Router({ mergeParams: true });
const CartService = require('../../../services/cart');
const { cartUpdateValidation } = require('../../validators/cartValidator');

const cartService = new CartService();

router.put('/',
    cartUpdateValidation,
    async (req, res) => {
        const appId = req.params.appId;
        const customerId = req.user.id;
        const { items } = req.body;

        const result = await cartService.update({ appId, customerId, items });
        res.json(result);
    });

router.get('/',
    async (req, res) => {
        const customerId = req.user.id;
        const result = await cartService.get(customerId);
        res.json(result);
    });

module.exports = router;