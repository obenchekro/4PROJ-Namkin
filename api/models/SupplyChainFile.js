const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supplyChainFileSchema = new Schema({
    machineId: {
        type: String,
        required: true
    },
    timeOfProduction: {
        type: Number,
        required: true
    },
    partId: {
        type: Number,
        required: true
    },
    order: {
        type: String,
        required: true
    },
    var1: {
        type: Number,
        required: true
    },
    var2: {
        type: String,
        required: true
    },
    var3: {
        type: String,
        required: true
    },
    var4: {
        type: Number,
        required: true
    },
    var5: {
        type: Boolean,
        required: true
    }
});

const SupplyChainFile = mongoose.model('SupplyChainFile', supplyChainFileSchema);

module.exports = SupplyChainFile;
