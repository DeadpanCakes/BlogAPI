const express = require("express");

const router = express.Router();

router.get("/posts/:postid/comments", (req, res, next) => {
  res.send("return all comments associated with post");
});

router.get("/posts/:postid/comments/commentid", (req, res, next) => {
  res.send("return specific comment");
});

router.post(
  "/posts/:postid/comments",
  (req, res, next) => {
    console.log("verify token");
    next();
  },
  (req, res, next) => {
    res.send("add new comment to db; update post with new comment");
  }
);

router.put(
  "/posts/:postid/comments/commentid",
  (req, res, next) => {
    console.log("verify token as user or admin");
    next();
  },
  (req, res, next) => {
    res.send("update comment");
  }
);

router.delete(
  "/posts/:postid/comments/commentid",
  (req, res, next) => {
    console.log("verify token as user or admin");
    next();
  },
  (req, res, next) => {
    console.log("delete comment");
  }
);

module.exports = router;