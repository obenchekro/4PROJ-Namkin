const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const methodOverride = require("method-override");


dotenv.config({ path: "./config/.env" });
const PORT = process.env.PORT || 8080;

const app = express();


app.use(express.json());
app.use(methodOverride("_method"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
