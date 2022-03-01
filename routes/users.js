var express = require("express");
var router = express.Router();

const userController = require("../controllers/users");
const verifyToken = require("../utils/verifyJWT");

/* GET users listing. */
router.get("/", userController.getUsers);

router.get("/:id", userController.getUser);

router.post("/", userController.postUser);

router.put("/:id", verifyToken, userController.updateUser);

router.delete("/:id", verifyToken, userController.deleteUser);

module.exports = router;
