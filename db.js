const mongoose = require("mongoose");
const dotenv = require("dotenv/config");

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
