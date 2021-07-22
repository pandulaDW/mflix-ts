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
}

module.exports = MoviesController;
