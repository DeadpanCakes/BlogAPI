const passport = require("passport");
const jwt = require("jsonwebtoken");

module.exports.login = [
  passport.authenticate("local", {
    failureRedirect: "/api/login",
  }),
  (req, res, next) => {
    const user = req.user.toObject();
    const payload = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName
    }
    jwt.sign(
      payload,
      process.env.PRIVATE_KEY,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) next(err);
        console.log(jwt.decode(token));
        res.json({ token });
      }
    );
  },
];
