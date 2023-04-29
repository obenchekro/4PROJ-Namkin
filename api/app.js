const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bodyparser = require("body-parser");
const methodOverride = require("method-override");


dotenv.config({ path: `${__dirname}/config/.env` });
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI

const app = express();
connectDB(MONGO_URI)

app.use(express.json());
app.use(methodOverride("_method"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

try {
  app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  });
} catch (err) {
  console.error(`Error starting server: ${err}`);
}
