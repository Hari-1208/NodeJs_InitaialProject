const express = require("express");

// to connect db we using mongoose
const mongoose = require("mongoose");

//config dot env
const config = require("dotenv").config({ path: "./.env" });
// set the db url
const url = process.env.DBURL;

const app = express();

//connect database to project using mongoose
mongoose.connect(url, {
  useNewUrlParser: true,
});

const connection = mongoose.connection;

connection.on("open", () => {
  console.log("connected");
});

app.use(express.json());

//Setting Route page here
const routes = require("./src/routes")(app);

// PORT
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
