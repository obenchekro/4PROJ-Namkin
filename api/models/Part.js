const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partInformationSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    defaultPrice: {
        type: Number,
        required: true
    },
    materials: {
        type: [String],
        required: true
    },
    timeToProduce: {
        type: Number,
        required: true
    },
    machines: {
        type: [Number],
        required: true
    }
});

const partSchema = new Schema({
    partId: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    partInformation: {
        type: partInformationSchema,
        required: true
    }
});

const Part = mongoose.model('Part', partSchema);

module.exports = Part;
