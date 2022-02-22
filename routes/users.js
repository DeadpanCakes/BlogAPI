var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get(
  "/",
  (req, res, next) => {
    console.log("verify token");
    next();
  },
  function (req, res, next) {
    res.send("respond with a resource");
  }
);

router.get(
  "/:id",
  (req, res, next) => {
    console.log("verify token");
    next();
  },
  (req, res, next) => {
    res.send("find by id and return");
  }
);

router.post("/", (req, res, next) => {
  res.send("add new user to db");
});

router.put(
  "/:id",
  (req, res, next) => {
    console.log("verify token");
    next();
  },
  (req, res, next) => {
    res.send("edit user's info");
  }
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
