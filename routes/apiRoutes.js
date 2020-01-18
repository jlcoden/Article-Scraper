var express = require("express");
// var request = require("request");
var cheerio = require("cheerio");
var db = require("../models");
var app = express.Router();
var axios = require("axios");

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
    axios.get("https://www.npr.org/sections/news/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      //grab article divs from npr website
      $("article").each(function(i, element) {
        // Save an empty result object
        var result = {};

        var title = $(element)
          .find("h2")
          .text();

        var link = $(element)
          .find("h2")
          .children()
          .attr("href");

        var summary = $(element)
          .find("p.teaser")
          .children()
          .text();

        //if title, summary, & link included
        if (title && summary && link) {
          // check if the article has already been added
          db.Article.find({ title }, function(err, data) {
            if (err) {
              res.status(404).send(err.toString());
            }
            if (data.length === 0) {
              db.Article.create({
                title,
                summary,
                link
              });
            }
          });
        }
      });
      res.redirect("/");
    });
  });

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

  // Route for grabbing a specific Article by id, populate it with it's note
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

  // app.put("/articles/:id", function(request, response) {
  //   var id = request.params.id;
  //   db.Article.update(
  //     { _id: id },
  //     { $set: { saved: request.body.saved } },
  //     function(result) {
  //       response.status(200).json({ message: "changed saved status" });
  //     }
  //   );
  // });

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
