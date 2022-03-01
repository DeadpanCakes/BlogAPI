const express = require("express");

const router = express.Router();
const postController = require("../controllers/posts");
const verifyToken = require("../utils/verifyJWT");

router.get("/", (req, res, next) => {
  res.send("return list of posts");
});

router.get("/:id", (req, res, next) => {
  res.send("return specified post");
});

router.post("/", verifyToken, postController.postPost);

router.put("/:id", verifyToken, (req, res, next) => {
  res.send("edit specified post");
});

router.delete("/:id", verifyToken, (req, res, next) => {
  res.send("delete specified token");
});

module.exports = router;
