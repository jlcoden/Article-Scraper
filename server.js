var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var app = express();
app.use(logger("dev"));
var exphbs = require("express-handlebars");
var MONGODB_URI =
  "mongodb://heroku_nv5tggdw:Dasani1987@ds059661.mlab.com:59661/heroku_nv5tggdw";

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
console.log(__dirname + "/public/img");
app.use(express.static(__dirname + "/public/img"));
require("dotenv").config();
var PORT = process.env.PORT || 3000;

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false })); // for form submissions

var MONGODB_URI = process.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.listen(PORT || 3000, function() {
  console.log("App running on port 3000!");
});
