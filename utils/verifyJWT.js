const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader.startsWith("Bearer ")) {
      req.token = bearerHeader.split(" ")[1];
      next()
  } else {
      res.sendStatus(403)
  }
};

module.exports = verifyToken;
