const passport = require("passport");

module.exports.login = passport.authenticate(
  "local",
  { failureRedirect: "/login", failureMessage: true },
  (req, res) => {
    res.send("successfully authenticated");
  }
);
