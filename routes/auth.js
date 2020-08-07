const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const User = require("../models/user");
const registerValidation = require("../validation/register");

router.post("/register", async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const { error, value } = registerValidation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const usernameExist = await User.findOne({ username: username });
    if(usernameExist) return res.status(400).send("username already exists")
    
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

module.exports = router;
