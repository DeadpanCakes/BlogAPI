const { body, validatonResult } = require("express-validator");
const async = require("async");

const Comment = require("../models/comment");
const isIDValid = require("../utils/isIDValid");
const doesDocExist = require("../utils/doesDocExist");
const User = require("../models/user");

const sanitize = (req, res, next) => {
  console.log("sanitize here");
  next();
};

module.exports.postComment = [
  body("content", "Comment Cannot Be Empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validatonResult(req);
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
        author: req.user,
        parent: req.body.parent,
        commentOf: req.params.postid,
      });
      newComment.save((err) => {
        if (err) next(err);
        res.json(newComment.url);
      });
    }
  },
];

module.exports.getComments = (req, res, next) => {
  Comment.find().exec((err, comments) => {
    if (err) next(err);
    res.json(comments);
  });
};

module.exports.getComment = (req, res, next) => {
  Comment.findById(req.params.id).exec((err, comment) => {
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
    const errors = validatonResult();
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
    //pull user
    let placeholderUser = {
      _id: null,
    };
    async.parallel(
      {
        comment: (cb) => Comment.findById(req.params.commentid).exec(cb),
        loggedUser: (cb) => User.findById(placeholderUser._id).exec(cb),
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
};
