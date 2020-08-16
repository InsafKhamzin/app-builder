const Cart = require('../models/Cart');
const ProductVariant = require('../models/ProductVariant');
const ClientError = require('../common/clientError');

module.exports = class CategoryService {

    async update({ appId, customerId, items }) {
        let cart = await Cart.findOne({ customer: customerId });
        if (!cart) {
            cart = new Cart({
                customer: customerId,
                items: []
            });
        }
        const productVariantIds = items.map(pV => pV.productVariantId);
        const productVariantsDb = await ProductVariant.find().populate('product').where('_id').in(productVariantIds).exec();

        const productVariantsMap = {};
        productVariantsDb.forEach(variant => {
            productVariantsMap[variant._id.toString()] = variant;
        });

        const newItems = [];
        items.forEach(item => {
            if (!productVariantsMap[item.productVariantId]) {
                throw new ClientError(`Product variant ${item.productVariantId} not found`, 404);
            }
            if (productVariantsMap[item.productVariantId].product.app.toString() !== appId) {
                throw new ClientError(`Invalid product variant id ${item.productVariantId}`, 400);
            }
            if (productVariantsMap[item.productVariantId].quantity < parseInt(item.quantity)) {
                throw new ClientError(`Low stock for product variant ${item.productVariantId}`, 400);
            }
            newItems.push({ productVariant: item.productVariantId, quantity: item.quantity });
        });
        cart.items = newItems;
        await cart.save();
        const cartPopulated = await cart
            .populate({ path: 'items.productVariant', populate: { path: 'product' } })
            .execPopulate();

        return cartPopulated.items;
    }

    async get(customerId) {
        const cart = await Cart.findOne({ customer: customerId })
            .populate({ path: 'items.productVariant', populate: { path: 'product' } });
        if (cart) {
            return cart.items;
        }
        return [];
    }
}