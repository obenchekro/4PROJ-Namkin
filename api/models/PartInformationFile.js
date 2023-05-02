const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const materialSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    prices: {
        type: [{
            price: {
                type: Number,
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
        }],
        required: true
    }
});

const partInformationFileSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    defaultPrice: {
        type: Number,
        required: true
    },
    materials: {
        type: [materialSchema],
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

const PartInformationFile = mongoose.model('PartInformationFile', partInformationFileSchema);

module.exports = PartInformationFile;
