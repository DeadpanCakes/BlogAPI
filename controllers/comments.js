const Comment = require("../models/comment");

const sanitize = (req, res, next) => {
  console.log("sanitize here");
  next();
};

module.exports.postComment = [
  sanitize,
  (req, res, next) => {
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
  sanitize,
  (req, res, next) => {
    Comment.findByIdAndUpdate(req.params.id).exec((err) => {
      if (err) next(err);
      Comment.findById(req.params.id).exec((err, comment) => {
        res.json(comment);
      });
    });
  },
];
