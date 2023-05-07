const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const priceSchema = new Schema({
    price: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
                const match = value.match(regex);
                if (!match) return false;

                const [_, month, day, year] = match;
                const date = new Date(year, month - 1, day);

                if (date.getFullYear() != year || date.getMonth() != month - 1 || date.getDate() != day) return false;
            },
            message: 'Invalid date format'
        }
    }
});

const materialFileSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    prices: {
        type: [priceSchema],
        required: true
    }
});

const MaterialFile = mongoose.model('MaterialFile', materialFileSchema);

module.exports = MaterialFile;
