const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// register api routers
app.get("/", (_, res) => {
  res.status(200).json({ message: "Hello" });
});

module.exports = app;
