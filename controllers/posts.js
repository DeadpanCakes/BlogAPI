const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const async = require("async");

const Post = require("../models/post");
const User = require("../models/user");
const isIDValid = require("../utils/isIDValid");
const doesDocExist = require("../utils/doesDocExist");
const validateParameter = require("../utils/validateParameter");

module.exports.postPost = [
  body("content", "Post Must Be Filled Out")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("title", "Post Must Have Title").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    jwt.verify(req.token, process.env.PRIVATE_KEY, (err, user) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { isPublished, tags, content, title } = req.body;
        if (!errors.isEmpty()) {
          res.status = 400;
          res.json({
            isPublished,
            tags,
            content,
            title,
            errors: errors.array().map((error) => error.msg),
          });
        } else {
          const timestamp = new Date();
          const newPost = new Post({
            isPublished,
            timestamp,
            tags,
            author: user._id,
            lastUpdate: timestamp,
            content,
            title,
          });
          newPost.save((err) => {
            if (err) next(err);
            res.redirect(newPost.url);
          });
        }
      }
    });
  },
];

module.exports.getPosts = (req, res, next) => {
  Post.find()
    .populate("author")
    .exec((err, posts) => {
      if (err) next(err);
      res.json(posts);
    });
};

module.exports.getPost = async (req, res, next) => {
  const validation = await validateParameter(req.params.id, Post);
  if (!validation.isValid) {
    res.status(validation.status);
    res.json({ msg: validation.errMsg });
  } else {
    if (!(await doesDocExist(req.params.id, Post))) {
      res.sendStatus(404);
    } else {
      Post.findById(req.params.id)
        .populate("author")
        .exec((err, post) => {
          if (err) next(err);
          res.json(post);
        });
    }
  }
};

module.exports.updatePost = [
  body("content", "Post Must Be Filled Out")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("title", "Post Must Have Title").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    if (!isIDValid(req.params.id)) {
      res.sendStatus(404);
    } else {
      jwt.verify(req.token, process.env.PRIVATE_KEY, (err, user) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.json({
            isPublished,
            tags,
            content,
            title,
            errors: errors.array().map((error) => error.msg),
          });
        } else {
          async.parallel(
            {
              post: (cb) =>
                Post.findById(req.params.id).populate("author").exec(cb),
              loggedUser: (cb) => User.findById(user._id).exec(cb),
            },
            (err, results) => {
              if (err) {
                next(err);
              } else if (!results.post) {
                res.sendStatus(404);
              } else if (!results.post.author.equals(results.loggedUser)) {
                res.sendStatus(403);
              } else {
                Post.findByIdAndUpdate(req.params.id, {
                  isPublished: req.body.isPublished,
                  tags: req.body.tags,
                  lastUpdate: new Date(),
                  content: req.body.content,
                  title: req.body.title,
                }).exec((err) => {
                  if (err) next(err);
                  Post.findById(req.params.id).exec((err, post) => {
                    if (err) next(err);
                    res.json(post);
                  });
                });
              }
            }
          );
        }
      });
    }
  },
];

module.exports.deletePost = async (req, res, next) => {
  if (!isIDValid(req.params.id)) {
    res.sendStatus(404);
  } else {
    jwt.verify(req.token, process.env.PRIVATE_KEY, (err, user) => {
      async.parallel(
        {
          post: (cb) => {
            Post.findById(req.params.id).populate("author").exec(cb);
          },
          loggedUser: (cb) => {
            User.findById(user._id).exec(cb);
          },
        },
        (err, results) => {
          const { post, loggedUser } = results;
          if (err) {
            next(err);
          } else if (!post) {
            res.sendStatus(404);
          } else if (!(loggedUser.isAdmin || post.author.equals(loggedUser))) {
            res.sendStatus(403);
          } else {
            Post.findByIdAndDelete(req.params.id).exec((err) => {
              if (err) {
                next(err);
              } else {
                res.redirect("/api/posts");
              }
            });
          }
        }
      );
    });
  }
};
