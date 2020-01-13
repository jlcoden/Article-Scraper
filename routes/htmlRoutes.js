var express = require("express");
var db = require("../models");
var router = express.Router();

module.exports = function(app) {
  // app.get("/", function(req, res) {
  //   res.render("home");
  // });

  app.get("/saved", function(req, res) {
    res.render("saved");
  });

  // app.get("/", function(req, res) {
  //   db.Article.find({ saved: false })
  //     .then(function(dbArticle) {
  //       res.render("scraped", { articles: dbArticle });
  //     })
  //     .catch(function(err) {
  //       res.json(err);
  //     });
  // });

  // app.get("/saved", function(req, res) {
  //   db.Article.find({ saved: true })
  //     .then(function(dbArticle) {
  //       res.render("saved", { articles: dbArticle });
  //     })
  //     .catch(function(err) {
  //       res.json(err);
  //     });
  // });
};
