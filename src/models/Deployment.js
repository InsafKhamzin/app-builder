const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeploymentSchema = new Schema({
    app: {
        type: Schema.Types.ObjectId,
        ref: 'app',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: Schema.Types.ObjectId,
        ref: 'image'
    },
    screenshots: [{
        type: Schema.Types.ObjectId,
        ref: 'image'
    }],
},
    {
        timestamps: true
    }
);

module.exports = Deployment = mongoose.model('deployment', DeploymentSchema)