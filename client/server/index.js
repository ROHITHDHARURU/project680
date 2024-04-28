require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const editUsersRoutes = require("./routes/editusers");
const historyRoutes=require("./routes/history")
const forgotPassRoutes= require("./routes/forgot-password")

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
//signup page api
app.use("/api/users", userRoutes);
//save login and retrieve user
app.use("/api/auth", authRoutes);

app.use("/api/editusers",editUsersRoutes);
//update the history
app.use("/api/history",historyRoutes);
//api to update then password
app.use("/api/forgot-password", forgotPassRoutes);

//port to be used - 4000
app.listen(4000, console.log(`Listening on port 4000...`));
