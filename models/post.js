const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    topic: {
      type: String,
      min: 3,
      max: 255,
      required: true,
    },
    detail: {
      type: String,
      min: 3,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const PostModel = mongoose.model("Post", postSchema);

module.exports = PostModel;
