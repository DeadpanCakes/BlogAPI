const express = require("express");

const router = express.Router();
const commentController = require("../controllers/comments");
const verifyToken = require("../utils/verifyJWT");

router.get("/posts/:postid/comments", commentController.getComments);

router.get("/posts/:postid/comments/:commentid", commentController.getComment);

router.post(
  "/posts/:postid/comments",
  verifyToken,
  commentController.postComment
);

router.put(
  "/posts/:postid/comments/:commentid",
  verifyToken,
  commentController.updateComment
);

router.delete(
  "/posts/:postid/comments/:commentid",
  verifyToken,
  commentController.deleteComment
);

module.exports = router;