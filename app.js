const express = require("express");
const app = express();
require("./db");
// Import Routes
const authRouter = require("./routes/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route
app.use("/api/user",authRouter);
// port server
app.listen(3000);
