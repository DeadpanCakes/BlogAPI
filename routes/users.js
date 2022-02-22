var express = require("express");
var router = express.Router();

const userController = require("../controllers/users");

/* GET users listing. */
router.get(
  "/",
  (req, res, next) => {
    console.log("verify token");
    next();
  },
  userController.getUsers
);

router.get(
  "/:id",
  (req, res, next) => {
    console.log("verify token");
    next();
  },
  userController.getUser
);

router.post("/", userController.postUser);

router.put(
  "/:id",
  (req, res, next) => {
    console.log("verify token");
    next();
  },
  userController.updateUser
);

router.delete(
  "/:id",
  (req, res, next) => {
    console.log("verify token");
    next();
  },
  (req, res, next) => {
    res.send("delete existing user");
  }
);

module.exports = router;
