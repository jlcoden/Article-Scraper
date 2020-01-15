var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var app = express();
app.use(logger("dev"));
var exphbs = require("express-handlebars");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
console.log(__dirname + "/public/img");
app.use(express.static(__dirname + "/public/img"));
var PORT = 3000;

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
var syncOptions = { force: false };
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false })); // for form submissions

mongoose.Promise = Promise;
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/articleScraper";
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

app.listen(process.env.PORT || 3000, function() {
  console.log("App running on port 8080!");
});
