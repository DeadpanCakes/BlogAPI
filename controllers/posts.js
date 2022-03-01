const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Post = require("../models/post");

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
          res.json({
            isPublished,
            tags,
            content,
            title,
            errors: errors.array().map((error) => error.msg),
          });
        } else {
          console.log(user);
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
  Post.find().exec((err, posts) => {
    if (err) next(err);
    res.json(posts);
  });
};

module.exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).exec((err, post) => {
    if (err) next(err);
    res.json(post);
  });
};

module.exports.updatePost = [
  body("content", "Post Must Be Filled Out")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("title", "Post Must Have Title").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
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
      Post.findByIdAndUpdate(req.params.id, req.body).exec((err) => {
        if (err) next(err);
        Post.findById(req.params.id).exec((err, post) => {
          if (err) next(err);
          res.json(post);
        });
      });
    }
  },
];

module.exports.deletePost = (req, res, next) => {
  Post.findByIdAndDelete(req.params.id).exec((err) => {
    if (err) next(err);
    res.redirect("/api/posts");
  });
};
