const express = require('express');
const router = express.Router({ mergeParams: true });
const DeliveryService = require('../../../services/delivery');

const deliveryService = new DeliveryService();

// @route GET delivery/
// @desc get delivery or pickup oprions

router.get('/', async (req, res) => {
    const appId = req.params.appId;
    const result = await deliveryService.getDelivery(appId);
    res.json(result);
});

module.exports = router;