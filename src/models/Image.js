const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    original: {
        type: String
    },
    original_low: {
        type: String
    },
    small: {
        type: String
    }
});

module.exports = ImageEntity = mongoose.model('image', ImageSchema)