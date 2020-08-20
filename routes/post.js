const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const postValidation = require("../validation/post");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/all", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const PostID = await Post.findById(req.params.id);
    res.json(PostID);
  } catch (error) {
    res.json(error);
  }
});

router.post("/add", authenticateToken, async (req, res) => {
  try {
    const token = req.header("authorization");
    const { topic, detail } = req.body;

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const { error, value } = postValidation.validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const post = new Post({
      topic: topic,
      detail: detail,
      userID: decoded._id,
    });

    const savePost = await post.save();
    res.json(savePost);
  } catch (error) {
    res.json(error);
  }
});

router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const token = req.header("authorization");
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const PostID = await Post.findById(req.params.id);
    if (PostID.userID !== decoded._id) return res.sendStatus(401);

    const { error, value } = postValidation.validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);
    
    const updateObject = req.body;
    const updatePost = await Post.updateOne(
      { _id: req.params.id },
      { $set: updateObject }
    );
    res.json(updatePost);
  } catch (error) {
    res.json(error);
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const token = req.header("authorization");
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const PostID = await Post.findById(req.params.id);
    if (PostID.userID !== decoded._id) return res.sendStatus(401);

    const removedPost = await Post.remove({ _id: req.params.id });
    res.json(removedPost);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
