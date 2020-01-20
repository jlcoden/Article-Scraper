var express = require("express");
// var request = require("request");
var cheerio = require("cheerio");
var db = require("../models");
// var app = express.Router();
var app = express();
var axios = require("axios");
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

module.exports = function(app) {
  //render homepage of found articles
  app.get("/", function(req, res) {
    db.Article.find({}, function(error, exists) {
      res.render("home", {
        article: exists
      });
    });
  });

  app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.npr.org/sections/news/").then(function(req) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(req.data);

      //grab article divs from npr website
      $("article").each(function(i, element) {
        // Save an empty result object
        var result = {};

        result.title = $(this)
          .find("h2")
          .text();

        result.link = $(this)
          .find("h2")
          .children()
          .attr("href");

        result.summary = $(this)
          .find("p.teaser")
          .children()
          .text();

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });

      // Send a message to the client
      res.redirect("/");
    });
  });

  //       //if title, summary, & link included
  //       if (result.title && result.summary && result.link) {
  //         // check if the article has already been added
  //         db.Article.find({ title }, function(err, data) {
  //           if (err) {
  //             res.status(404).send(err.toString());
  //           }
  //           if (data.length === 0) {
  //             db.Article.create({
  //               title,
  //               summary,
  //               link
  //             });
  //           }
  //         });
  //       }
  //     });
  //     res.redirect("/");
  //   });
  // });

  app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.get("/note", function(req, res) {
    // Find all Notes
    db.Note.find({})
      .then(function(dbNote) {
        // If all Notes are successfully found, send them back to the client
        res.json(dbNote);
      })
      .catch(function(err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });

  // CHANGE STATUS TO SAVED
  app.put("/articles/:id", function(req, res) {
    var id = req.params.id;
    db.Article.update(
      { _id: id },
      { $set: { saved: req.body.saved } },
      function(result) {
        res.status(200).json({ message: "update saved status" });
      }
    );
  });

  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)

      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { note: dbNote._id },
          { new: true }
        );
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.put("/article/delete/:id", function(req, res) {
    db.Article.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { saved: false } }
    )
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  //KEEP THIS API ROUTE
  app.get("/saved", function(req, res) {
    db.Article.find({}, function(error, exists) {
      res.render("saved", {
        article: exists
      });
    });
  });

  app.get("/clear", function(req, res) {
    console.log(req.body);
    db.Article.deleteMany({}, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        // res.send(true);
        res.render("home");
      }
    });
  });
};
