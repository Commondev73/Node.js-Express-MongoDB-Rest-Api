const express = require("express");
const app = express();
require("./db");
// Import Routes
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route
app.use("/api/user", authRouter);
app.use("/api/post", userRouter);
// port server
app.listen(3000);
