const express = require("express");
const app = express();
require("./db");
// Import Routes
const authRoute = require("./routes/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route
app.use("/api/user" ,authRoute);
// port server
app.listen(3000);
