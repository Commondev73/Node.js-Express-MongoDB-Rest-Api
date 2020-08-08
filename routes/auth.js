const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const registerValidation = require("../validation/register");
const loginValidation = require("../validation/login");

const generateAccessToken = user => {
  return  jwt.sign({_id:user._id , name: user.name},process.env.ACCSESS_TOKEN_SECRET,{ expiresIn:"60s" });
}

const generateRefreshToken = user => {
  return  jwt.sign({_id:user._id , name: user.name},process.env.REFRESH_TOKEN_SECRET);
}

router.post("/register", async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const { error, value } = registerValidation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const usernameExist = await User.findOne({ username: username });
    if (usernameExist) return res.status(400).send("username already exists");

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      name: name,
      username: username,
      password: hashPassword,
    });

    const saveUser = await user.save();
    res.send(saveUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const { error, value } = loginValidation.validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const user = await User.findOne({ username: username });
    if (!user) return res.status(400).json("username is wrong");

    const PwIsCorrect = bcrypt.compareSync(password, user.password);
    if (!PwIsCorrect) return res.status(400).json("password is wrong");

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    res.json({accessToken: accessToken , refreshToken : refreshToken})

  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
