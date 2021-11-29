var express = require("express");
var bodyParser=require("body-parser")
let app=express()
let cors=require("cors")
let path=require("path")
var dateFormat = require('dateformat');
const dotenv = require('dotenv');
dotenv.config()
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/dynamicAPI');
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());
app.use('/',require('./routes/api'));


app.listen(4000);
console.log("sevrer is listening on port no:4000");

