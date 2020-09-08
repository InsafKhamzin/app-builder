const express = require('express');
const router = express.Router();
const DeliveryService = require('../../../services/delivery');
const { pickupAddValidator, pickupIdValidator } = require('../../validators/deliveryValidator');

const deliveryService = new DeliveryService();

router.post('/pickup', pickupAddValidator, async (req, res) => {
    const appId = req.params.appId;
    const result = await deliveryService.addPickup(appId, req.body);
    return res.json(result);
});

router.get('/', async (req, res) => {
    const appId = req.params.appId;
    const result = await deliveryService.getDelivery(appId);
    return res.json(result);
});

router.delete('/pickup/:pickupId', pickupIdValidator, async (req, res) => {
    const pickupId = req.params.pickupId;
    await deliveryService.deletePickup(pickupId);
    return res.send();
});

module.exports = router;
