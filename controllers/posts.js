const Post = require("../models/post");

const sanitize = (req, res, next) => {
  console.log("sanitize here");
  next();
};

module.exports.postPost = (req, res, next) => {
  const { isPublished, tags, content, title } = req.body;
  const timestamp = new Date();
  const newPost = new Post({
    isPublished,
    timestamp,
    tags,
    author: req.user,
    lastUpdate: timestamp,
    content,
    title,
  });
  newPost.save((err) => {
    if (err) next(err);
    res.redirect(newPost.url);
  });
};
