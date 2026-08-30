require('dotenv').config();
const mongoose = require("mongoose");
const express = require('express');
const app = require("./app");
const cors = require('cors');
const config = require("./config/config");

// Silence console.log in production
if (config.env === 'production') {
  console.log = () => {};
}

app.use(cors());

mongoose.connect(config.mongoose.url, config.mongoose.options).then(()=>{
    console.log("Connected to DB at ", config.mongoose.url);
}).catch((error)=>{
    console.error("Failed to connect to DB:", error);
});

app.use(express.json());

app.listen(config.port, () => {
    console.log("app is listening on port: ", config.port);
});
