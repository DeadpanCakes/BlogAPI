var express = require("express");
var router = express.Router();

const users = require("./users");
const comments = require("./comments");
const posts = require("./posts");

module.exports = { users, comments, posts };
