const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    const token = req.header("authorization");
    if (!token) return res.status(401).json("Access Denied");

    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // req.user = verified;
    // console.log(verified);
    next();
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = authenticateToken;
