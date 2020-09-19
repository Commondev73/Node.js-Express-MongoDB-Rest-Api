const express = require("express");
const app = express();
require("./db");
// Import Routes
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");

// Open folder
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(multer());

// Route
app.use("/api/user", authRouter);
app.use("/api/post", postRouter);
// port server
app.listen(3000);
