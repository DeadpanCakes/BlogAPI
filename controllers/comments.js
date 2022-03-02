const { body, validationResult } = require("express-validator");
const async = require("async");
const jwt = require("jsonwebtoken");

const Comment = require("../models/comment");
const isIDValid = require("../utils/isIDValid");
const doesDocExist = require("../utils/doesDocExist");
const User = require("../models/user");
const Post = require("../models/post");

module.exports.postComment = [
  body("content", "Comment Cannot Be Empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    jwt.verify(req.token, process.env.PRIVATE_KEY, (err, user) => {
      if (err) next(err);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.json({
          content: req.body.content,
          errors: errors.array().map((error) => error.msg),
        });
      } else {
        const timestamp = new Date();
        const newComment = new Comment({
          timestamp,
          content: req.body.content,
          author: user,
          parent: req.body.parent,
          commentOf: req.params.postid,
        });
        newComment.save((err) => {
          if (err) next(err);
          res.redirect(`/api/posts/${req.params.postid}` + newComment.url);
        });
      }
    });
  },
];

module.exports.getComments = (req, res, next) => {
  Post.findById(req.params.id).exec((err, post) => {
    if (err) next(err);
    Comment.where({ commentOf: post }).exec((err, comments) => {
      if (err) next(err);
      res.json(comments);
    });
  });
};

module.exports.getComment = (req, res, next) => {
  Comment.findById(req.params.commentid).exec((err, comment) => {
    if (err) next(err);
    res.json(comment);
  });
};

module.exports.updateComment = [
  body("content", "Comment Cannot Be Empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        content: req.body.content,
        errors: errors.array().map((error) => error.msg),
      });
    } else {
      Comment.findByIdAndUpdate(req.params.id).exec((err) => {
        if (err) next(err);
        Comment.findById(req.params.id).exec((err, comment) => {
          res.json(comment);
        });
      });
    }
  },
];

module.exports.deleteComment = (req, res, next) => {
  if (!isIDValid(req.params.id)) {
    res.sendStatus(404);
  } else if (!doesDocExist(req.params.id, Comment)) {
    res.sendStatus(404);
  } else {
    jwt.verify(req.token, process.env.PRIVATE_KEY, (err, user) => {
      if (err) {
        next(err);
      } else {
        async.parallel(
          {
            comment: (cb) => Comment.findById(req.params.commentid).exec(cb),
            loggedUser: (cb) => User.findById(user._id).exec(cb),
          },
          (err, results) => {
            if (err) {
              next(err);
            } else {
              const { comment, loggedUser } = results;
              if (!comment.author.equals(loggedUser)) {
                res.sendStatus(403);
              } else {
                Comment.findByIdAndDelete(req.params.id).exec((err) => {
                  res.redirect(`/api/posts/${postid}/comments`);
                });
              }
            }
          }
        );
      }
    });
  }
};
