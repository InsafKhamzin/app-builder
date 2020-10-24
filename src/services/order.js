const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Delivery = require('../models/Delivery')
const ClientError = require('../common/clientError');

module.exports = class OrderService {
    async add({ appId, customerId, orderInfo }) {

        const { pickupId, deliveryId, ...deliveryInfo } = orderInfo;

        const cart = await Cart.findOne({ customer: customerId }).populate('items.productVariant');
        if (!cart || cart.items.length === 0) {
            throw new ClientError('Cart is empty', 400)
        }
        //add delivery price
        let totalPrice = 0;
        if (deliveryId) {
            const delivery = await Delivery.findById(deliveryId);
            if (delivery) {
                totalPrice += delivery.price;
            }
        }
        //sum up all items price
        cart.items.forEach(item => {
            totalPrice += item.productVariant.purchasePrice * item.quantity;
        });

        const newOrder = new Order({
            app: appId,
            customer: customerId,
            total: totalPrice,
            items: cart.items,
            pickup: pickupId,
            delivery: deliveryId,
            deliveryInfo: deliveryInfo
        });

        cart.items = [];
        await cart.save();
        await newOrder.save();

        const newOrderPopulated = newOrder
            .populate('pickup')
            .populate('delivery')
            .execPopulate();

        return newOrderPopulated;
    }

    async delete({ customerId, orderId }) {
        const order = await Order.find({ _id: orderId, customer: customerId });
        if (!order) {
            throw new ClientError('Order not found', 404);
        }
        if (order.status !== 'new') {
            throw new ClientError('Wrong status of order', 400);
        }
        await Order.findByIdAndDelete(orderId);
    }
}