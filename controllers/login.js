const passport = require("passport");

module.exports.login = [
  passport.authenticate("local", {
    failureRedirect: "/api/login",
  }),
  (req, res) => {
    res.send("success");
  },
];
