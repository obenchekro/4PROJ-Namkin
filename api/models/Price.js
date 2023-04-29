const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const priceSchema = new Schema({
    price: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    }
});

const Price = mongoose.model('Price', priceSchema);

module.exports = Price;
