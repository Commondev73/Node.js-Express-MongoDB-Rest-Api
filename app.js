const express = require("express");
const app = express();
require("./db");
// Import Routes
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route
app.use("/api/user", authRouter);
app.use("/api/post", postRouter);
// port server
app.listen(3000);
