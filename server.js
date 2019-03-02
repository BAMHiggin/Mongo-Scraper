var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("/models");

var PORT = process.env.PORT || "3000";

var app = express();

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

/////////////

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(MONGODB_URI);  

app.get("/scrape", (req, res)=> {
   axios.get("http://www.echojs.com/")
   .then(response => {
    var $ = cheerio.load(response.data);

    
   })
})