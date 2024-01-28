const jwt = require("jsonwebtoken");
const config = require("./config.json");

module.exports = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        res.status(401).json({ error: true, message: "Unauth Access...!" });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    res.send(403).send({ error: true, message: "No Token Found" });
  }
};
