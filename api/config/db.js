const mongoose = require("mongoose");

const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const connectDB = async (connectorString) => {
    try {
        const con = await mongoose.connect(connectorString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected on ${con.connection.host}`);
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;