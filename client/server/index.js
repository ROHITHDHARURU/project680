require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const usersDataRoutes = require("./routes/usersData");
const editUsersRoutes = require("./routes/editusers");
const historyRoutes=require("./routes/history")

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/usersData",usersDataRoutes);
app.use("/api/editusers",editUsersRoutes);
app.use("/api/history",historyRoutes);


app.listen(4000, console.log(`Listening on port 4000...`));
