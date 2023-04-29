const mongoose = require("mongoose");

const dotenv = require('dotenv');

dotenv.config({ path: '.env' });
const MONGO_CONNECTION_STRING = process.env.MONGO_URI

const connectDB = async () => {
    try {
        const con = await mongoose.connect(MONGO_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected on ${con.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;