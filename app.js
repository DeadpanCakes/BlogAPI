require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");

var router = require("./routes/index");
const User = require("./models/user");

var app = express();

app.use(helmet());
app.use(cors());

const { DEV_DB_URL } = process.env;
const mongoDB = process.env.MONGO_URI || DEV_DB_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

passport.use(
  new LocalStrategy((username, password, next) => {
    User.findOne({ username }).exec((err, user) => {
      if (err) next(err);
      if (!user) {
        return next(null, false, { message: "User Does Not Exist" });
      } else {
        bcrypt.compare(password, user.password, (err, res) => {
          if (err) next(err);
          if (res) {
            return next(null, user);
          } else {
            return next(null, false, { message: "Wrong Password" });
          }
        });
      }
    });
  })
);

passport.serializeUser((user, next) => {
  next(null, user.id);
});
passport.deserializeUser((id, next) => {
  User.findById(id, (err, user) => {
    next(err, user);
  });
});

app.use(passport.initialize());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(compression());

app.use("/api/users", router.users);
app.use("/api/login", router.login);
app.use("/api", router.comments);
app.use("/api/posts", router.posts);
app.use("/", (req, res) => res.send("Home Page"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
