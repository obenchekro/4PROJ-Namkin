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
        type: [Number],
        required: true
    },
    date: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                const regex = /^\d{2}-\d{2}-\d{4}$/;
                return regex.test(value);
            },
            message: 'Invalid date format'
        }
    }
});

const SalesFile = mongoose.model('SalesFile', salesFileSchema);

module.exports = SalesFile;
