//Dependencies


var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require("cheerio");

//requiring models
var db = require("./models");

//custom port or 3000 port
var PORT = process.env.PORT || "3000";

var app = express();

//Will use deployed database, else use local
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

/////////////

//configuring express

//logging requests
app.use(logger("dev"));
//json parse
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//static folder
app.use(express.static("public"));

//connects to Mongo
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


console.log("\n***********************************\n" +
            "Grabbing articles and links\n" +
            "from NU News:" +
            "\n***********************************\n");

app.get("/scrape", (req, res) => {
    axios.get("https://news.northwestern.edu/")
        .then(response => {
            var $ = cheerio.load(response.data);

            $("article h4").each(function (i, element) {
                //saves empty object
                var result = {};

                //grabs texts and links
                result.title = $(this)
                    .children("a")
                    .text();
                result.link = $(this)
                    .children("a")
                    .attr("href");

                db.Article.create(result)
                    //TODO: test function when working and see if it can be updated to ES6
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });

            res.send("Scrape Complete");

        });
});

// Grabbing all articles from db
app.get("/articles", (req, res) => {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// grabbing specific article by ID, populate with it's note

app.get("/articles/:id", (req, res) => {
    db.Article.findOne({_id: req.params.id})
    .populate("note")
})


app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});