const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const async = require("async");

const User = require("../models/user");
const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.postUser = [
  body("username", "Username Required").trim().isLength({ min: 1 }).escape(),
  body("firstName", "First Name Required").trim().isLength({ min: 1 }).escape(),
  body("lastName", "Last Name Required").trim().isLength({ min: 1 }).escape(),
  body("password", "Password Required").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const { username, firstName, lastName } = req.body;
    User.findOne({ username }).exec((err, existingUser) => {
      if (err) next(err);
      if (existingUser) {
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
          bcrypt.hash(req.body.password, 10, (err, encryptedPass) => {
            if (err) next(err);
            const newUser = new User({
              username,
              firstName,
              lastName,
              password: encryptedPass,
              isAdmin: false,
            });
            newUser.save((err) => {
              if (err) next(err);
              res.redirect(newUser.url);
            });
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

module.exports.getUserActivity = (req, res, next) => {
  async.parallel(
    {
      posts: (cb) => {
        Post.find({ author: req.params.id }).limit(3).populate("url").exec(cb);
      },
      comments: (cb) => {
        Comment.find({ author: req.params.id })
          .limit(3)
          .populate("url")
          .exec(cb);
      },
    },
    (err, results) => {
      if (err) {
        next(err);
      } else {
        res.json(results);
      }
    }
  );
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        errors: errors.array().map((error) => error.msg),
      });
    } else {
      jwt.verify(req.token, process.env.PRIVATE_KEY, (err, user) => {
        if (err) {
          next(err);
        } else {
          async.parallel(
            {
              targetUser: (cb) => User.findById(req.params.id).exec(cb),
              loggedUser: (cb) => User.findById(user._id).exec(cb),
            },
            (err, results) => {
              if (err) {
                next(err);
              } else {
                const { targetUser, loggedUser } = results;
                if (!(loggedUser.isAdmin || targetUser.equals(loggedUser))) {
                  res.sendStatus(403);
                } else {
                  User.findByIdAndUpdate(req.params.id, req.body).exec(
                    (err) => {
                      if (err) next(err);
                      User.findById(req.params.id).exec((err, user) => {
                        if (err) next(err);
                        res.json(user);
                      });
                    }
                  );
                }
              }
            }
          );
        }
      });
    }
  },
];

module.exports.deleteUser = (req, res, next) => {
  jwt.verify(req.token, process.env.PRIVATE_KEY, (err, user) => {
    if (err) {
      next(err);
    } else {
      async.parallel(
        {
          targetUser: (cb) => User.findById(req.params.id).exec(cb),
          loggedUser: (cb) => User.findById(user._id).exec(cb),
        },
        (err, results) => {
          if (err) {
            next(err);
          } else {
            const { targetUser, loggedUser } = results;
            if (!(loggedUser.isAdmin || targetUser.equals(loggedUser))) {
              res.sendStatus(403);
            } else {
              User.findByIdAndDelete(req.params.id).exec((err) => {
                if (err) next(err);
                User.find().exec((err, users) => {
                  if (err) next(err);
                  res.json(users);
                });
              });
            }
          }
        }
      );
    }
  });
};
