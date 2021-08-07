const MoviesDAO = require("../dao/moviesDAO");

class MoviesController {
  static async apiGetMovies(_, res) {
    const MOVIES_PER_PAGE = 20;
    const { moviesList, totalNumMovies } = await MoviesDAO.getMovies();
    let response = {
      movies: moviesList,
      page: 0,
      filters: {},
      entries_per_page: MOVIES_PER_PAGE,
      total_results: totalNumMovies,
    };

    res.json(response);
  }

  static async apiGetMoviesByCountry(req, res) {
    let countries = req.query.countries === "" ? "USA" : req.query.countries;
    let countryList = Array.isArray(countries) ? countries : Array(countries);
    let moviesList = await MoviesDAO();
  }
}

module.exports = MoviesController;
