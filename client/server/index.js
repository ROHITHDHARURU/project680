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
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/editusers",editUsersRoutes);
app.use("/api/history",historyRoutes);
app.use("/api/forgot-password", forgotPassRoutes);


app.listen(4000, console.log(`Listening on port 4000...`));
