const express = require("express");

const router = express.Router();
const postController = require("../controllers/posts");
const verifyToken = require("../utils/verifyJWT");

router.get("/", postController.getPosts);

router.get("/:id", postController.getPost);

router.post("/", verifyToken, postController.postPost);

router.put("/:id", verifyToken, postController.updatePost);

router.delete("/:id", verifyToken, postController.deletePost);

module.exports = router;
