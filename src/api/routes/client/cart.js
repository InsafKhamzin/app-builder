const express = require('express');
const router = express.Router({ mergeParams: true });
const CartService = require('../../../services/cart');
const { cartAddValidation } = require('../../validators/cartValidator');

const cartService = new CartService();

// @route GET category/
// @desc get category tree

router.post('/add',
    cartAddValidation,
    async (req, res) => {
        const appId = req.params.appId;
        const customerId = req.user.id;
        const { productVariantId, quantity } = req.body;

        const result = await cartService.add({ appId, customerId, productVariantId, quantity });
        res.json(result);
    });

module.exports = router;