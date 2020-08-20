const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const registerValidation = require("../validation/register");
const loginValidation = require("../validation/login");

const generateAccessToken = user => {
  return  jwt.sign({_id:user._id , name: user.name},process.env.ACCESS_TOKEN_SECRET,{ expiresIn:"15m" });
}

const generateRefreshToken = user => {
  return  jwt.sign({_id:user._id , name: user.name},process.env.REFRESH_TOKEN_SECRET,{ expiresIn:"7d" });
}

let RefreshToken = []

router.post("/register", async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const { error, value } = registerValidation.validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const usernameExist = await User.findOne({ username: username });
    if (usernameExist) return res.status(400).json("username already exists");

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

router.post("/token/refresh",async (req,res) => {
  try {
    const { refreshToken } = req.body;
    if(!refreshToken) return res.sendStatus(401);
    if(!RefreshToken.includes(refreshToken)) return res.sendStatus(403)
    const user = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
    const accessToken = generateAccessToken(user)
    // const decoded = jwt.decode(refreshToken);
    res.json({accessToken: accessToken })
  } catch (error) {
    res.status(400).send(error);
  }
})

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
    RefreshToken.push(refreshToken)
    res.json({accessToken: accessToken , refreshToken : refreshToken})

  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/logout",async(req,res)=>{
  const {refreshToken} = req.body;
  RefreshToken  = RefreshToken.filter(token => token !== refreshToken)
  res.sendStatus(204);
})

module.exports = router;
