const express = require("express");

const router = express.router();

router.get("/", (req, res, next) => {
  res.send("return list of posts");
});

router.get("/:id", (req, res, next) => {
  res.send("return specified post");
});

router.post("/", (req, res, next) => {
  res.send("post new post");
});

router.put(
  "/:id",
  (req, res, next) => {
    console.log("verify token");
    next();
  },
  (req, res, next) => {
    res.send("edit specified post");
  }
);

router.delete(
  "/:id",
  (req, res, next) => {
    console.log("verify token");
    next();
  },
  (req, res, next) => {
    res.send("delete specified token");
  }
);
