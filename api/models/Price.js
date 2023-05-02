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
                const regex = /^\d{2}-\d{2}-\d{4}$/;
                return regex.test(value);
            },
            message: 'Invalid date format'
        }
    }
});

const Price = mongoose.model('Price', priceSchema);

module.exports = Price;
