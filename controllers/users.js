const User = require("../models/user");

const sanitize = (req, res, next) => {
  console.log("sanitize input");
  next();
};

module.exports.makeNewUser = [
  sanitize,
  (req, res, next) => {
    const { username, firstName, lastName } = req.body;
    User.find({ username }).exec((err, existingUser) => {
      if (err) next(err);
      if (existingUser) {
        res.send("username taken");
      } else {
        const newUser = newUser({
          username,
          firstName,
          lastName,
          isAdmin: false,
        });
        newUser.save((err) => {
          if (err) next(err);
          res.redirect("/");
        });
      }
    });
  },
];
