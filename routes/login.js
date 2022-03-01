const express = require("express");

const loginController = require("../controllers/login");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("please post credentials")
})

router.post("/", loginController.login);

module.exports = router