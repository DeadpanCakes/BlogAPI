const { body, validationResult } = require("express-validator");
const async = require("async");
const jwt = require("jsonwebtoken");

const Comment = require("../models/comment");
const isIDValid = require("../utils/isIDValid");
const doesDocExist = require("../utils/doesDocExist");
const User = require("../models/user");
const Post = require("../models/post");
const validateParameter = require("../utils/validateParameter");

module.exports.postComment = [
  body("content", "Comment Cannot Be Empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    jwt.verify(req.token, process.env.PRIVATE_KEY, (err, user) => {
      if (err) {
        next(err);
      } else {
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
          newComment.save((err, comment) => {
            if (err) next(err);
            res.json(comment);
          });
        }
      }
    });
  },
];

module.exports.getComments = (req, res, next) => {
  const { postid } = req.params;
  if (!isIDValid(postid)) {
    res.status(404);
    res.json({ message: `Post ${postid} is invalid` });
  } else if (!doesDocExist(postid, Post)) {
    res.status(404);
    res.json({ message: `Post ${postid} does not exist` });
  } else {
    Post.findById(req.params.postid).exec((err, post) => {
      if (err) next(err);
      Comment.where({ commentOf: post })
        .populate("author")
        .populate("commentOf")
        .exec((err, comments) => {
          if (err) next(err);
          res.json(comments);
        });
    });
  }
};

module.exports.getComment = async (req, res, next) => {
  res.status(404);
  const { postid, commentid } = req.params;
  if (!isIDValid(postid)) {
    res.json({ message: `Post ${postid} is invalid` });
  } else if (!isIDValid(commentid)) {
    res.json({ message: `Comment ${commentid} is invalid` });
  } else {
    const postExists = await doesDocExist(postid, Post);
    const commentExists = await doesDocExist(commentid, Comment);
    if (!postExists) {
      res.json({ message: `Post ${postid} does not exist` });
    } else if (!commentExists) {
      res.json({ message: `Comment ${commentid} does not exist` });
    } else {
      Comment.findById(req.params.commentid)
        .populate("author")
        .populate("commentOf")
        .exec((err, comment) => {
          if (err) next(err);
          if (comment.commentOf._id.toString() !== postid) {
            res.json({
              message: `Post ${postid} does not have comment ${commentid}`,
            });
          } else {
            res.status(200);
            res.json(comment);
          }
        });
    }
  }
};

module.exports.updateComment = [
  (req, res, next) => {
    if (!isIDValid) {
      res.sendStatus(404);
    } else {
      next();
    }
  },
  (req, res, next) => {
    if (!doesDocExist) {
      res.sendStatus(404);
    } else {
      next();
    }
  },
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
        async.parallel(
          {
            comment: (cb) =>
              Comment.findById(req.params.commentid)
                .populate("author")
                .populate("commentOf")
                .exec(cb),
            user: (cb) => User.findById(user._id).exec(cb),
          },
          (err, results) => {
            if (err) next(err);
            const { comment, user } = results;
            if (!(comment.author.equals(user) && !user.isAdmin)) {
              res.send(403);
            } else {
              Comment.findByIdAndUpdate(req.params.commentid, {
                content: req.body.content,
              }).exec((err) => {
                if (err) next(err);
                Comment.findById(req.params.commentid).exec((err, comment) => {
                  res.json(comment);
                });
              });
            }
          }
        );
      }
    });
  },
];

module.exports.deleteComment = async (req, res, next) => {
  const validation = await validateParameter(req.params.commentid, Comment);
  if (!validation.isValid) {
    res.status(validation.status);
    res.json(validation.errMsg);
  } else {
    jwt.verify(req.token, process.env.PRIVATE_KEY, (err, user) => {
      if (err) {
        next(err);
      } else {
        async.parallel(
          {
            comment: (cb) =>
              Comment.findById(req.params.commentid)
                .populate("author")
                .populate("commentOf")
                .exec(cb),
            loggedUser: (cb) => User.findById(user._id).exec(cb),
          },
          (err, results) => {
            if (err) {
              next(err);
            } else {
              const { comment, loggedUser } = results;
              const post = comment.commentOf;
              if (!comment.author.equals(loggedUser) && !loggedUser.isAdmin) {
                res.status(403);
                res.json({ message: "Permission denied" });
              } else {
                Comment.findByIdAndDelete(req.params.commentid).exec((err) => {
                  if (err) next(err);
                  res.json({ post, comments: post.url + "/comments" });
                });
              }
            }
          }
        );
      }
    });
  }
};
