const express = require("express");
const MoviesController = require("../controllers/moviesController");

const router = express.Router();

router.route("/").get(MoviesController.apiGetMovies);

module.exports = router;
