const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partSchema = new Schema({
    partId: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const cashSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    }
});

const salesFileSchema = new Schema({
    contractNumber: {
        type: Number,
        required: true
    },
    clientName: {
        type: String,
        required: true
    },
    parts: {
        type: [partSchema],
        required: true
    },
    cash: {
        type: [cashSchema],
        required: true
    },
    date: {
        type: String,
        required: true
    }
});

const SalesFile = mongoose.model('SalesFile', salesFileSchema);

module.exports = SalesFile;
