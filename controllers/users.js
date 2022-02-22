const User = require("../models/user");

const sanitize = (req, res, next) => {
  console.log("sanitize input");
  next();
};

module.exports.makeNewUser = [
  sanitize,
  (req, res, next) => {
    const { username, firstName, lastName } = req.body;
    console.log(req.body);
    User.findOne({ username }).exec((err, existingUser) => {
      if (err) next(err);
      if (existingUser) {
        console.log(existingUser);
        res.send("username taken");
      } else {
        const newUser = new User({
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

module.exports.getUsers = [
  sanitize,
  (req, res, next) => {
    User.find((err, users) => {
      if (err) next(err);
      res.json(users);
    });
  },
];
