const express = require('express');
const router = express.Router({ mergeParams: true });
const DeliveryService = require('../../../services/delivery');
const { pickupAddValidator, pickupIdValidator,
    deliveryAddValidator, deliveryIdValidator } = require('../../validators/deliveryValidator');

const deliveryService = new DeliveryService();

router.post('/pickup', pickupAddValidator, async (req, res) => {
    const appId = req.params.appId;
    const result = await deliveryService.addPickup(appId, req.body);
    return res.json(result);
});

router.put('/pickup/:pickupId',
    [pickupIdValidator, pickupAddValidator],
    async (req, res) => {
        const appId = req.params.appId;
        const pickupId = req.params.pickupId;
        const result = await deliveryService.updatePickup(appId, pickupId, req.body);
        return res.json(result);
    });

router.delete('/pickup/:pickupId', pickupIdValidator, async (req, res) => {
    const appId = req.params.appId;
    const pickupId = req.params.pickupId;
    await deliveryService.deletePickup(appId, pickupId);
    return res.send();
});

router.post('/', deliveryAddValidator, async (req, res) => {
    const appId = req.params.appId;
    const result = await deliveryService.addDelivery(appId, req.body);
    return res.json(result);
});

router.put('/:deliveryId',
    [deliveryAddValidator, deliveryIdValidator],
    async (req, res) => {
        const appId = req.params.appId;
        const deliveryId = req.params.deliveryId;
        const result = await deliveryService.updateDelivery(appId, deliveryId, req.body);
        return res.json(result);
    });

router.delete('/:deliveryId', deliveryIdValidator, async (req, res) => {
    const appId = req.params.appId;
    const deliveryId = req.params.deliveryId;
    await deliveryService.deleteDelivery(appId, deliveryId);
    return res.send();
});


router.get('/', async (req, res) => {
    const appId = req.params.appId;
    const result = await deliveryService.getDelivery(appId);
    return res.json(result);
});

module.exports = router;
