const { body, validationResult } = require("express-validator");

const User = require("../models/user");

module.exports.postUser = [
  body("username", "Username Required").trim().isLength({ min: 1 }).escape(),
  body("firstName", "First Name Required").trim().isLength({ min: 1 }).escape(),
  body("lastName", "Last Name Required").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const { username, firstName, lastName } = req.body;
    console.log(req.body);
    User.findOne({ username }).exec((err, existingUser) => {
      if (err) next(err);
      if (existingUser) {
        console.log(existingUser);
        res.send("username taken");
      } else {
        if (!errors.isEmpty()) {
          res.json({
            username,
            firstName,
            lastName,
            errors: errors.array().map((error) => error.msg),
          });
        } else {
          const newUser = new User({
            username,
            firstName,
            lastName,
            isAdmin: false,
          });
          newUser.save((err) => {
            if (err) next(err);
            res.redirect("/users");
          });
        }
      }
    });
  },
];

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id).exec((err, user) => {
    if (err) next(err);
    res.json(user);
  });
};

module.exports.getUsers = (req, res, next) => {
  User.find((err, users) => {
    if (err) next(err);
    res.json(users);
  });
};

module.exports.updateUser = [
  body("username", "Username Required").trim().isLength({ min: 1 }).escape(),
  body("firstName", "First Name Required").trim().isLength({ min: 1 }).escape(),
  body("lastName", "Last Name Required").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req.body);
    if (errors.isEmpty()) {
      res.send({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        errors: errors.array().map((error) => error.msg),
      });
    } else {
      User.findByIdAndUpdate(req.params.id, req.body).exec((err) => {
        if (err) next(err);
        User.findById(req.params.id).exec((err, user) => {
          if (err) next(err);
          res.json(user);
        });
      });
    }
  },
];

module.exports.deleteUser = (req, res, next) => {
  User.findByIdAndDelete(req.params.id).exec((err) => {
    if (err) next(err);
    User.find().exec((err, users) => {
      if (err) next(err);
      res.json(users);
    });
  });
};
