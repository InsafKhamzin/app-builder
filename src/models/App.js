const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppSchema = new Schema({
    config: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        index: true
    }
},
    {
        timestamps: true
    }
);

module.exports = App = mongoose.model('app', AppSchema);