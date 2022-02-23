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

module.exports.updatePost = (req, res, next) => {
  Post.findByIdAndUpdate(req.params.id, req.body).exec((err) => {
    if (err) next(err);
    res.redirect(req.params.id);
  });
};
