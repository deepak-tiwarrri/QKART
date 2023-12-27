require('dotenv').config();
const mongoose = require("mongoose");
const express = require('express');
const app = require("./app");
const cors = require('cors');
const config = require("./config/config");
// const routes = require('./routes/v1/index.js');
app.use(cors());
// const DB_URI = 'mongodb://127.0.0.1:27017/qkart';
// let server;

mongoose.connect(`${config.mongoose.url}`).then(()=>{
    console.log("Connected to DB at ",config.mongoose.url);
}).catch((error)=>{
    console.log("Failed to connect to DB at",error);
});
app.use(express.json());
// app.use('/v1',routes);
app.listen(config.port,()=>{
    console.log("app is listening on port: ",config.port);
})


// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Create Mongo connection and get the express app to listen on config.port
