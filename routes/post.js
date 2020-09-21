const express = require("express");
const router = express.Router();

const Post = require("../models/post");
const postValidation = require("../validation/post");
const authenticateToken = require("../middleware/authenticateToken");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const { Buffer } = require("buffer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, Date.now() + "." + file.originalname.split(".").pop());
  },
});

const limits = {
  fileSize: 1000 * 1000 * 3,
};

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only .png, .jpg and .jpeg format allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: limits,
  fileFilter: fileFilter,
});
const image = upload.array("image");

router.get("/all", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.json(error);
  }
});

router.get("/user", authenticateToken, async (req, res) => {
  try {
    const { decoded } = res.locals;
    const postUser = await Post.find({ userID: decoded._id });
    res.json(postUser);
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

router.post("/add", authenticateToken, (req, res) => {
  try {
    image(req, res, async (err) => {
      const { decoded } = res.locals;
      const { topic, detail } = req.body;

      const image = req.files.map((file) => ({
        imageName: file.filename,
        url:file.path,
      }));

      if (err) return res.status(400).json({ error: err.message });

      const { error, value } = postValidation.validate(req.body);
      if (error) return res.status(400).json(error.details[0].message);

      const post = new Post({
        topic: topic,
        detail: detail,
        image: req.files ? image : [],
        userID: decoded._id,
      });

      const savePost = await post.save();
      res.json(savePost);
    });
  } catch (error) {
    res.json(error);
  }
});

router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const { decoded } = res.locals;

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
    const { decoded } = res.locals;

    const PostID = await Post.findById(req.params.id);
    if (PostID.userID !== decoded._id) return res.sendStatus(401);

    const removedPost = await Post.remove({ _id: req.params.id });
    res.json(removedPost);
  } catch (error) {
    res.json(error);
  }
});

router.post("/upload", async (req, res) => {
  try {
    image(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message });

      const results = req.file ? "has file" : "no file";
      // console.log("test", req.files);
      const image = req.files.map((file) => file.path);
      // console.log("file", req.file.path);
      // res.send(req.file);
      res.json(image);
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

let someArray = [
  { imageName: "Kristian", url: "2,5,10" },
  { imageName: "John", url: "1,19,26,96" },
  { imageName: "tee", url: "2,58,160" },
  { imageName: "Felix", url: "1,19,26,96" },
];

const deleteImage = [{ imageName: "Kristian"},{ imageName: "tee"}];
const results = someArray.filter((image) => image.imageName !== "Kristian");
var filteredArray = _.differenceBy(someArray, deleteImage, 'imageName');
console.log("filtered", results);
console.log("filteredArray", filteredArray);
module.exports = router;
