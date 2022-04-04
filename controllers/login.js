const passport = require("passport");
const jwt = require("jsonwebtoken");

module.exports.login = [
  passport.authenticate("local", {
    failureRedirect: "/api/login",
  }),
  (req, res, next) => {
    jwt.sign(req.user.toObject(), process.env.PRIVATE_KEY, {expiresIn: "1h"}, (err, token) => {
      if (err) next(err);
      res.json({ token });
    });
  },
];