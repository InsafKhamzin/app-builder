const Pickup = require('../models/Pickup');
const Delivery = require('../models/Delivery');
const ClientError = require('../common/clientError');

module.exports = class DeliveryService {

    async addPickup(appId, pickupInfo) {
        const newPickupPoint = new Pickup({
            ...pickupInfo,
            app: appId
        });
        await newPickupPoint.save();
        return this.getDelivery(appId);
    }

    async updatePickup(appId, pickupId, pickupInfo) {
        const pickup = await Pickup.findOne({ _id: pickupId, app: appId });
        if (!pickup) {
            throw new ClientError('Pickup not found', 404);
        }
        
        pickup.phone = pickupInfo.phone;
        pickup.address = pickupInfo.address;
        pickup.description = pickupInfo.description;
        pickup.longitude = pickupInfo.longitude;
        pickup.latitude = pickupInfo.latitude;
        pickup.workingHours = pickupInfo.workingHours;

        await pickup.save();
        return this.getDelivery(appId);
    }

    async deletePickup(appId, pickupId) {
        await Pickup.findOneAndDelete({ _id: pickupId, app: appId });
    }

    async getDelivery(appId) {
        const deliveries = await Delivery.find({ app: appId });
        const pickups = await Pickup.find({ app: appId });
        return {
            deliveries,
            pickups
        };
    }

    async addDelivery(appId, deliveryInfo){
        const newDelivery = new Delivery({
            ...deliveryInfo,
            app: appId
        });
        await newDelivery.save();
        return this.getDelivery(appId);
    }

    async updateDelivery(appId, deliveryId, deliveryInfo){
        const delivery = await Delivery.findOne({ _id: deliveryId, app: appId });
        if (!delivery) {
            throw new ClientError('Delivery not found', 404);
        }

        delivery.name = deliveryInfo.name;
        delivery.description = deliveryInfo.description;
        delivery.price = deliveryInfo.price;
        delivery.freeFrom = deliveryInfo.freeFrom;
        delivery.period = deliveryInfo.period;
        
        await delivery.save();
        return this.getDelivery(appId);
    }

    async deleteDelivery(appId, deliveryId) {
        await Delivery.findOneAndDelete({ _id: deliveryId, app: appId });
    }
};