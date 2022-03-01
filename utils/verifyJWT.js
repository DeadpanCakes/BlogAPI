const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    if (bearerHeader.startsWith("Bearer")) {
      req.token = bearerHeader.split(" ")[1];
      //save token in local storage
      next();
    }
  } else {
    res.sendStatus(403);
  }
};

module.exports = verifyToken;
