const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const moviesRouter = require("./routers/moviesRouter");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// register api routes
app.use("/api/v1/movies", moviesRouter);

module.exports = app;
