const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompilationSchema = new Schema({
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
        type: String
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: 'image'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    }
},
    {
        timestamps: true
    }
    
);

module.exports = App = mongoose.model('compilation', CompilationSchema);