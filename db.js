const mongoose = require("mongoose");
const dotenv = require("dotenv/config");

mongoose.connect(process.env.DB_CONNECTION, {
  useCreateIndex: true, // fix DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead. // in pm2
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
