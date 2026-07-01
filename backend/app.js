const express = require("express");
const cors = require("cors");
const { env } = require("./config/env");

const routes = require("./routes");
const taskRoutes = require("./routes/taskRoutes");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Task Tracker API",
    version: "1.0.0",
  });
});

app.use("/api", routes);
app.use("/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;