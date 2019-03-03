
//code borrowed from previous Mongoose scraping exercise
//Dependencies


const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const axios = require("axios");
const cheerio = require("cheerio");

//handlebars setup
const exphbs = require("express-handlebars");

//requiring models
const db = require("./models");

//custom port or 3000 port
const PORT = process.env.PORT || "3000";

const app = express();

//handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Will use deployed database, else use local
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

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


// Routing info

app.get("/", (req, res) => {
    db.Article.find({})
        .then(function (dbArticle) {
            let handlebarsObject = {
                articles: dbArticle
            };
            res.render("index", handlebarsObject);
        })
});

//Getting scraped data
app.get("/scrape", (req, res) => {
    axios.get("https://news.northwestern.edu/")
        .then(response => {
            let $ = cheerio.load(response.data);

            $("article h4").each(function (i, element) {
                //saves empty object
                let result = {};

                //grabs texts and links
                result.title = $(this)
                    .children("a")
                    .text();


                //IMPORTANT - hrefs for certain links only produced a relative path
                // if statement below adds 'www.news.northwestern.edu' to any url result that doesn't produce a complete URL
                let linkURL = $(this)
                    .children("a")
                    .attr("href");

                if (linkURL[0] === '/') {
                    linkURL = 'https://news.northwestern.edu' + linkURL;
                }
                result.link = linkURL;

                db.Article.create(result)
                    .then((dbArticle) => {
                        console.log(dbArticle);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });

            res.send("Scrape Complete <br> <a href='/'>Go Back</a>");


        });

});


////DB

// Grabbing all articles from db
app.get("/articles", (req, res) => {
    db.Article.find({})
        .then((dbArticle) => {
            res.json(dbArticle);
        })
        .catch((err) => {
            res.json(err);
        });
});


// grabbing specific article by ID, populate with it's note

app.get("/articles/:id", (req, res) => {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then((dbArticle) => {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch((err) => {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", (req, res) => {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then((dbNote) => {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then((dbArticle) => {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch((err) => {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


app.listen(PORT, () => {
    console.log("App running on port " + PORT + "!");
});