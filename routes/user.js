const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authenticateToken");

router.get("/user", authenticateToken, (req, res) => {
  res.json({ message: "asdasdasd" });
});

module.exports = router;
