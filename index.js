const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const route = require("./app/routes/benrouter");
const cors = require("cors")
require("dotenv").config();

mongoose.connect("mongodb://127.0.0.1:27017/BENAPI").then(() => {
  console.log("connected to database");
});

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(cors());
// parse requests of content-type - application/json
app.use(express.json({ limit: "50mb" }));

// parse requests of content-type - application/json
// app.use(bodyParser.json())

app.use((req, res, next) => {
  console.log("secure");
  console.log("HTTP method is " + req.method + ", URL -" + req.url);
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Authkey,AccessToken"
  );

  next();
});

app.use(express.json());
app.use(route);

// listen for requests
const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});



