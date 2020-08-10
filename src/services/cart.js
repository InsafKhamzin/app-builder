const Cart = require('../models/Cart');
const ProductVariant = require('../models/ProductVariant');
const ClientError = require('../common/clientError');

module.exports = class CategoryService {
    async add({ appId, customerId, productVariantId, quantity }) {
        const productVariant = await ProductVariant.findById(productVariantId).populate('product');
        if (!productVariant) {
            throw new ClientError('Product variant not found', 404);
        }
        if (productVariant.product.app.toString() !== appId) {
            throw new ClientError('Invalid product variant id', 400);
        }
        let cart = await Cart.findOne({ customer: customerId });
        //if cart doesnt exits the create new
        if (!cart) {
            cart = new Cart({
                customer: customerId,
                items: [{ productVariant: productVariantId, quantity }]
            });
        } else {
            const existingIdx = cart.items.findIndex(x => x.productVariant.toString() === productVariantId);
            if (existingIdx === -1) {
                cart.items.push({ productVariant: productVariantId, quantity });
            } else {
                cart.items[existingIdx].quantity += quantity;
            }
        }
        await cart.save();
        const cartPopulated = await cart
            .populate({ path: 'items.productVariant', populate: { path: 'product' } })
            .execPopulate();

        return cartPopulated;
    }
}