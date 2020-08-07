const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 255,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      min: 6,
      max: 255,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      min: 6,
    },
  },
  { timestamps: true, versionKey: false }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
