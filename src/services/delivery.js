const Pickup = require('../models/Pickup');
const Delivery = require('../models/Delivery');

module.exports = class DeliveryService {

    async addPickup(appId, pickupInfo) {
        const newPickupPoint = new Pickup({
            ...pickupInfo,
            app: appId
        });
        await newPickupPoint.save();
        return this.getDelivery(appId);
    }
    async deletePickup(pickupId) {
        await Pickup.findByIdAndDelete(pickupId);
    }

    async getDelivery(appId) {
        const deliveries = await Delivery.find({ app: appId });
        const pickups = await Pickup.find({ app: appId });
        return {
            deliveries,
            pickups
        };
    }

    async deleteDelivery(deliveryId) {
        await Delivery.findByIdAndDelete(deliveryId);
    }
};